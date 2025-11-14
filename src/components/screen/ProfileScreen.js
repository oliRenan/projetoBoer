import React, { useState } from 'react';
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
import { auth } from '../../services/connectionFirebase';
import { 
    updatePassword, 
    deleteUser, 
    reauthenticateWithCredential, 
    EmailAuthProvider,
    signOut // <-- 1. IMPORTAR O signOut
} from 'firebase/auth';
import Toast from 'react-native-toast-message';

export default function ProfileScreen({ setUser }) {
    const { colors } = useTheme(); 
    const user = auth.currentUser;
    
    const [newPassword, setNewPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [loadingLogout, setLoadingLogout] = useState(false); // <-- 2. ESTADO DE LOADING P/ LOGOUT

    const notify = (message, type = 'error') => {
        Toast.show({
            type: type,
            text1: message,
            position: 'bottom',
            visibilityTime: 3000,
        });
    };

    // <-- 3. ADICIONAR A FUNÇÃO handleLogout
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

    const reauthenticate = async () => {
        if (!currentPassword) {
            notify('Digite sua senha atual para confirmar.');
            throw new Error('Senha atual não fornecida.');
        }
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        return reauthenticateWithCredential(user, credential);
    };

    const handleUpdatePassword = async () => {
        // ... (código existente)
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
        // ... (código existente)
        if (!currentPassword) {
            notify('Digite sua senha atual para excluir a conta.');
            return;
        }
        setDialogVisible(true);
    };

    const hideDeleteDialog = () => setDialogVisible(false);

    const confirmDeleteProfile = async () => {
        // ... (código existente)
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
            
            <Text style={styles.sectionTitle}>Alterar Senha</Text>
            
            <TextInput
                label="Nova Senha"
                value={newPassword}
                // ... (props existentes)
                style={styles.input}
                mode="outlined"
                secureTextEntry
                activeOutlineColor={colors.primary}
                left={<TextInput.Icon icon="lock-reset" />}
            />

            <Text style={styles.warning}>
                * Para salvar ou excluir, confirme sua senha atual abaixo.
            </Text>

            <TextInput
                label="Senha Atual (Obrigatório)"
                value={currentPassword}
                // ... (props existentes)
                style={styles.input}
                mode="outlined"
                secureTextEntry
                activeOutlineColor={colors.primary}
                left={<TextInput.Icon icon="lock" />}
            />

            <Button
                mode="contained"
                onPress={handleUpdatePassword}
                loading={loading}
                disabled={loading || loadingLogout} // <-- 4. DESABILITAR COM OS DOIS LOADINGS
                style={[styles.saveButton, { backgroundColor: colors.primary }]}
                icon="content-save"
            >
                Atualizar Senha
            </Button>

            {/* // <-- 4. ESTE É O BOTÃO DE LOGOUT */}
            <Button
                mode="contained"
                onPress={handleLogout}
                loading={loadingLogout}
                disabled={loading || loadingLogout}
                style={[styles.logoutButton, { backgroundColor: colors.accent }]} 
                textColor={colors.background}
                icon="logout"
            >
                Sair (Logout)
            </Button>
            
            <View style={styles.divider} />

            <Button
                mode="outlined"
                onPress={showDeleteDialog}
                loading={loading}
                disabled={loading || loadingLogout} // <-- 4. DESABILITAR COM OS DOIS LOADINGS
                textColor="red" 
                style={styles.deleteButton}
                icon="delete-forever"
            >
                Excluir Minha Conta
            </Button>

            <Portal>
                <Dialog visible={dialogVisible} onDismiss={hideDeleteDialog}>
                    {/* ... (código do dialog existente) ... */}
                </Dialog>
            </Portal>

        </View>
    );
}

// 5. ADICIONAR O ESTILO PARA 'logoutButton'
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
    logoutButton: { // <-- 5. ESTILO ADICIONADO
        marginTop: 15,
        borderRadius: 8,
    },
    deleteButton: {
        borderColor: 'red',
        borderRadius: 8,
    },
    divider: {
        height: 1,
        backgroundColor: '#444', 
        marginVertical: 30,
    }
});
