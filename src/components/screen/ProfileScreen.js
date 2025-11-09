import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { 
    TextInput, 
    Button, 
    Title, 
    Text, 
    Portal, 
    Dialog,
    useTheme // 1. Importar 'useTheme'
} from 'react-native-paper';
import { auth } from '../../services/connectionFirebase';
import { 
    updatePassword, 
    deleteUser, 
    reauthenticateWithCredential, 
    EmailAuthProvider 
} from 'firebase/auth';
import Toast from 'react-native-toast-message';

export default function ProfileScreen({ setUser }) {
    // 2. Pegar as cores do tema
    const { colors } = useTheme(); 
    const user = auth.currentUser;
    
    const [newPassword, setNewPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);

    // --- LÓGICA (NÃO MUDOU) ---
    const notify = (message, type = 'error') => {
        Toast.show({ type, text1: message, position: 'bottom', visibilityTime: 3000 });
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
            if (error.code === 'auth/wrong-password') notify('Senha atual incorreta.');
            else if (error.code === 'auth/requires-recent-login') notify('Por favor, faça login novamente antes de tentar.');
            else notify('Erro ao atualizar senha.');
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
            if (error.code === 'auth/wrong-password') notify('Não foi possível excluir: Senha incorreta.');
            else notify('Erro ao excluir conta.');
        } finally {
            setLoading(false);
        }
    };
    // --- FIM DA LÓGICA ---

    if (!user) {
        return (
             <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Title>Erro</Title><Text>Usuário não encontrado.</Text>
            </View>
        );
    }

    return (
        // 3. Aplicar cor de fundo (branca)
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Title style={[styles.title, { color: colors.onBackground }]}>Meu Perfil</Title>
            
            {/* <TextInput */}
            {/*     label="E-mail (não editável)" */}
            {/*     value={user.email} */}
            {/*     style={styles.input} */}
            {/*     mode="outlined" */}
            {/*     disabled={true} */}
            {/*     activeOutlineColor={colors.primary} // Vermelho */}
            {/*     outlineColor={colors.outline} // Cinza */}
            {/*     left={<TextInput.Icon icon="email" />} */}
            {/* /> */}
            
            <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>Alterar Senha</Text>
            
            <TextInput
                label="Nova Senha"
                value={newPassword}
                onChangeText={setNewPassword}
                style={styles.input}
                mode="outlined"
                secureTextEntry
                activeOutlineColor={colors.primary} // Vermelho
                outlineColor={colors.outline}
                left={<TextInput.Icon icon="lock-reset" />}
            />

            <Text style={[styles.warning, { color: colors.onSurfaceVariant }]}>
                * Para salvar ou excluir, confirme sua senha atual abaixo.
            </Text>

            <TextInput
                label="Senha Atual (Obrigatório)"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                style={styles.input}
                mode="outlined"
                secureTextEntry
                activeOutlineColor={colors.primary} // Vermelho
                outlineColor={colors.outline}
                left={<TextInput.Icon icon="lock" />}
            />

            <Button
                mode="contained"
                onPress={handleUpdatePassword}
                loading={loading}
                disabled={loading}
                style={[styles.saveButton, { backgroundColor: colors.primary }]} // Vermelho
                textColor={colors.onPrimary} // Branco
                icon="content-save"
            >
                Atualizar Senha
            </Button>
            
            {/* 4. Divisor cinza claro */}
            <View style={[styles.divider, { backgroundColor: colors.outline }]} />

            <Button
                mode="outlined"
                onPress={showDeleteDialog}
                loading={loading}
                disabled={loading}
                textColor={colors.error} // Vermelho (do tema)
                style={[styles.deleteButton, { borderColor: colors.error }]} // Borda vermelha
                icon="delete-forever"
            >
                Excluir Minha Conta
            </Button>

            <Portal>
                {/* 5. O Dialog pegará o tema claro automaticamente */}
                <Dialog visible={dialogVisible} onDismiss={hideDeleteDialog}>
                    <Dialog.Title>Confirmar Exclusão</Dialog.Title>
                    <Dialog.Content>
                        <Text variant="bodyMedium">
                            Esta ação é irreversível. Você tem certeza que deseja excluir permanentemente sua conta?
                        </Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={hideDeleteDialog}>Cancelar</Button>
                        <Button onPress={confirmDeleteProfile} textColor={colors.error}>Excluir</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    title: {
        textAlign: 'center',
        marginBottom: 30,
        fontSize: 28,
        fontWeight: 'bold',
    },
    sectionTitle: {
        marginTop: 20,
        marginBottom: 10,
        fontSize: 18,
        fontWeight: 'bold',
    },
    input: {
        marginBottom: 15,
        // O tema claro cuida do fundo do input
    },
    warning: {
        fontSize: 13,
        marginBottom: 10,
        fontStyle: 'italic',
        textAlign: 'center',
    },
    saveButton: {
        marginTop: 20,
        borderRadius: 10,
        height: 55,
        justifyContent: 'center',
    },
    deleteButton: {
        marginTop: 15,
        borderRadius: 10,
        height: 55,
        justifyContent: 'center',
    },
    divider: {
        height: 1,
        marginVertical: 35,
    }
});
