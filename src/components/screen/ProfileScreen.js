import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { 
    TextInput, 
    Button, 
    Title, 
    Text, 
    Portal, 
    Dialog,
    useTheme 
} from 'react-native-paper';
import { auth, database } from '../../services/connectionFirebase'; 
import { 
    updatePassword, 
    deleteUser, 
    reauthenticateWithCredential, 
    EmailAuthProvider,
    signOut
} from 'firebase/auth';
import { ref, onValue, update } from "firebase/database"; 
import Toast from 'react-native-toast-message';

// NÃO PRECISA DE NENHUM IMPORT DE MÁSCARA

export default function ProfileScreen({ setUser }) {
    const { colors } = useTheme(); 
    const user = auth.currentUser;
    
    // Estados para Senha e Ações
    const [newPassword, setNewPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [loadingLogout, setLoadingLogout] = useState(false);

    // Estados para o Perfil
    const [endereco, setEndereco] = useState('');
    // O estado 'telefone' guardará o valor LIMPO (só números)
    const [telefone, setTelefone] = useState(''); 
    const [loadingProfile, setLoadingProfile] = useState(false);

    // useEffect para carregar os dados
    useEffect(() => {
        if (user) {
            const userProfileRef = ref(database, `usuarios/${user.uid}`);
            
            const unsubscribe = onValue(userProfileRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    setEndereco(data.endereco || '');
                    setTelefone(data.telefone || ''); // Armazena o valor limpo vindo do DB
                }
            });

            return () => unsubscribe();
        }
    }, [user]); 

    // 1. FUNÇÃO MANUAL PARA MASCARAR O TELEFONE
    const maskTelefone = (value) => {
        if (!value) return '';
        let v = value.replace(/\D/g, ''); // Remove tudo que não é dígito
        v = v.substring(0, 11); // Limita a 11 dígitos (00 00000 0000)

        // Aplica a máscara progressivamente
        if (v.length > 10) {
            // (00) 00000-0000
            v = v.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
        } else if (v.length > 5) {
            // (00) 00000-
            v = v.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
        } else if (v.length > 2) {
            // (00) 00000
            v = v.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2');
        } else if (v.length > 0) {
            // (00
            v = v.replace(/^(\d{0,2}).*/, '($1');
        }
        
        return v;
    };

    // 2. FUNÇÃO HANDLER PARA O ONCHANGETEXT DO TELEFONE
    const handleTelefoneChange = (maskedText) => {
        // Recebe o texto mascarado do input, limpa, e salva SÓ OS NÚMEROS no estado
        const unmaskedText = maskedText.replace(/\D/g, '');
        setTelefone(unmaskedText);
    };

    const notify = (message, type = 'error') => {
        Toast.show({
            type: type,
            text1: message,
            position: 'bottom',
            visibilityTime: 3000,
        });
    };
    
    const handleLogout = () => {
        setLoadingLogout(true);
        signOut(auth).then(() => {
            if (setUser) setUser(''); 
        }).catch((error) => {
            console.error("Erro ao fazer logout: ", error);
            notify('Erro ao tentar sair da conta.', 'error');
            setLoadingLogout(false);
        });
    };

    const handleSaveProfile = async () => {
        if (!user) return;

        // A validação continua usando o estado 'telefone' (limpo)
        if (!endereco.trim() || !telefone.trim()) {
            notify('Por favor, preencha o endereço e o telefone.', 'error');
            return;
        }

        if (telefone.length !== 11) {
             notify('Por favor, digite um telefone válido com 11 dígitos.', 'error');
            return;
        }

        setLoadingProfile(true);
        const userProfileRef = ref(database, `usuarios/${user.uid}`);

        try {
            // Salva o valor 'telefone' (limpo, sem máscara)
            await update(userProfileRef, {
                endereco: endereco,
                telefone: telefone 
            });
            notify('Perfil atualizado com sucesso!', 'success');
        } catch (error) {
            console.error("Erro ao salvar perfil: ", error);
            notify('Erro ao salvar o perfil.', 'error');
        } finally {
            setLoadingProfile(false);
        }
    };

    // --- Funções de Autenticação (Senha e Exclusão) ---

    const reauthenticate = async () => {
        if (!currentPassword) {
            notify('Digite sua senha atual para confirmar.');
            throw new Error('Senha atual não fornecida.');
        }
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        return reauthenticateWithCredential(user, credential);
    };

    const handleUpdatePassword = async () => {
        if (!newPassword.trim()) {
            notify('Digite uma nova senha para alterar.');
            return;
        }
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,}$/;
        if (!passwordRegex.test(newPassword)) {
            notify('A senha deve ter letras, números e símbolos (mín. 6).');
            return;
        }
        if (!currentPassword.trim()) {
            notify('Digite sua senha atual para confirmar a alteração.');
            return;
        }
        setLoading(true);
        try {
            await reauthenticate();
            await updatePassword(user, newPassword);
            notify('Senha atualizada com sucesso!', 'success');
            setNewPassword('');
            setCurrentPassword('');
        } catch (error) {
            if (error.code === 'auth/wrong-password') {
                notify('Senha atual incorreta.');
            } else if (error.code === 'auth/requires-recent-login') {
                 notify('Por favor, faça login novamente antes de tentar.');
            } else {
                notify('Erro ao atualizar senha.');
            }
        } finally {
            setLoading(false);
        }
    };

    const showDeleteDialog = () => {
        if (!currentPassword) {
            notify('Digite sua senha atual para excluir a conta.');
            return;
        }
        setDialogVisible(true);
    };

    const hideDeleteDialog = () => setDialogVisible(false);

    const confirmDeleteProfile = async () => {
        hideDeleteDialog();
        setLoading(true);
        try {
            await reauthenticate();
            await deleteUser(user);
            notify('Conta excluída.', 'success');
            if (setUser) setUser(null); 
        } catch (error) {
            if (error.code === 'auth/wrong-password') {
                notify('Não foi possível excluir: Senha incorreta.');
            } else {
                notify('Erro ao excluir conta.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return null; 
    }

    const anyLoading = loading || loadingLogout || loadingProfile;

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Title style={styles.title}>Meu Perfil</Title>
            
            <TextInput
                label="E-mail (não editável)"
                value={user.email}
                style={styles.input} 
                mode="outlined"
                disabled={true}
                left={<TextInput.Icon icon="email" />}
            />
            
            <Text style={styles.sectionTitle}>Dados Pessoais</Text>
            
            {/* 3. ATUALIZAÇÃO DO TEXTINPUT DE TELEFONE */}
            <TextInput
                label="Telefone"
                mode="outlined"
                keyboardType="phone-pad" // Mantém o teclado numérico
                activeOutlineColor={colors.primary}
                style={styles.input}
                left={<TextInput.Icon icon="phone" />}
                disabled={anyLoading}
                // O 'value' agora passa pelo formatador
                value={maskTelefone(telefone)} 
                // O 'onChangeText' usa nosso handler customizado
                onChangeText={handleTelefoneChange} 
                // Limita o tamanho do texto (incluindo máscara)
                maxLength={15} // (00) 00000-0000
            />

            <TextInput
                label="Endereço"
                value={endereco}
                onChangeText={setEndereco}
                style={styles.input} 
                mode="outlined"
                activeOutlineColor={colors.primary}
                left={<TextInput.Icon icon="map-marker" />}
                disabled={anyLoading}
            />
            <Button
                mode="contained"
                onPress={handleSaveProfile}
                loading={loadingProfile}
                disabled={anyLoading} 
                style={[styles.saveButton, { backgroundColor: colors.primary }]}
                icon="content-save"
            >
                Salvar Dados Pessoais
            </Button>

            <View style={styles.divider} /> 

            <Text style={styles.sectionTitle}>Alterar Senha</Text>
            
            <TextInput
                label="Nova Senha"
                value={newPassword}
                onChangeText={setNewPassword}
                style={styles.input}
                mode="outlined"
                secureTextEntry
                activeOutlineColor={colors.primary}
                left={<TextInput.Icon icon="lock-reset" />}
                disabled={anyLoading}
            />

            <Text style={styles.warning}>
                * Para salvar ou excluir, confirme sua senha atual abaixo.
            </Text>

            <TextInput
                label="Senha Atual (Obrigatório)"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                style={styles.input}
                mode="outlined"
                secureTextEntry
                activeOutlineColor={colors.primary}
                left={<TextInput.Icon icon="lock" />}
                disabled={anyLoading}
            />

            <Button
                mode="contained"
                onPress={handleUpdatePassword}
                loading={loading}
                disabled={anyLoading}
                style={[styles.saveButton, { backgroundColor: colors.primary }]}
                icon="content-save"
            >
                Atualizar Senha
            </Button>
            
            <Button
                mode="contained"
                onPress={handleLogout}
                loading={loadingLogout}
                disabled={anyLoading}
                style={[styles.logoutButton, { backgroundColor: colors.accent }]} 
                textColor={colors.background}
                icon="logout"
            >
                Sair (Logout)
            </Button>
            
            <Button
                mode="outlined"
                onPress={showDeleteDialog}
                loading={loading}
                disabled={anyLoading}
                textColor="red" 
                style={styles.deleteButton}
                icon="delete-forever"
            >
                Excluir Minha Conta
            </Button>

            <Portal>
                <Dialog visible={dialogVisible} onDismiss={hideDeleteDialog}>
                    <Dialog.Title>Confirmar Exclusão</Dialog.Title>
                    <Dialog.Content>
                        <Text variant="bodyMedium">
                            Tem certeza que deseja excluir sua conta?
                        </Text>
                        <Text variant="bodySmall" style={{ marginTop: 10 }}>
                            Esta ação não pode ser desfeita.
                        </Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={hideDeleteDialog} disabled={loading}>
                            Cancelar
                        </Button>
                        <Button
                            onPress={confirmDeleteProfile}
                            textColor={colors.error}
                            loading={loading}
                            disabled={loading}
                        >
                            Excluir
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

        </View>
    );
}

// Estilos permanecem os mesmos
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: 'bold',
    },
    sectionTitle: {
        marginTop: 15,
        marginBottom: 5,
        fontWeight: 'bold',
        fontSize: 16,
    },
    input: {
        marginBottom: 12,
    },
    warning: {
        fontSize: 12,
        marginBottom: 5,
        fontStyle: 'italic',
    },
    saveButton: {
        marginTop: 10,
        borderRadius: 8,
    },
    logoutButton: { 
        marginTop: 15,
        borderRadius: 8,
    },
    deleteButton: {
        borderColor: 'red',
        borderRadius: 8,
        marginTop: 15,
    },
    divider: {
        height: 1,
        backgroundColor: '#444', 
        marginVertical: 30,
    }
});
