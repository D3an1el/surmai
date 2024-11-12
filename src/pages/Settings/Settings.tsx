import { Avatar, Button, Container, Group, Paper, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { openContextModal } from '@mantine/modals';
import { useDocumentTitle, useMediaQuery } from '@mantine/hooks';
import { getAttachmentUrl, updateUser } from '../../lib';
import { useCurrentUser } from '../../auth/useCurrentUser.ts';
import { UserSettingsForm } from '../../components/account/UserSettingsForm.tsx';

export const Settings = () => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery('(max-width: 50em)');
  const { user, reloadUser } = useCurrentUser();
  useDocumentTitle(t('settings', 'Settings'));

  return (
    <Container>
      <Paper withBorder radius="md" p="xl" bg={'var(--mantine-color-body)'}>
        <Title order={2} fw={700} py={'sm'}>
          {t('user_settings', 'User Settings')}
        </Title>
        <Group wrap="nowrap" mt={'sm'}>
          <Avatar
            name={user?.name}
            color={'initials'}
            src={user?.avatar && getAttachmentUrl(user, user.avatar)}
            size={200}
            radius="md"
          />
          {user && (
            <Button
              onClick={() => {
                openContextModal({
                  modal: 'uploadImageForm',
                  title: t('basic.add_cover_image', 'Add Cover Image'),
                  radius: 'md',
                  withCloseButton: false,
                  size: 'auto',
                  fullScreen: isMobile,
                  innerProps: {
                    aspectRatio: 400 / 400,
                    saveUploadedImage: (uploadedImage: File | Blob) => {
                      updateUser(user.id, uploadedImage).then(() => {
                        reloadUser && reloadUser();
                      });
                    },
                  },
                });
              }}
            >
              {t('change_avatar', 'Change Avatar')}
            </Button>
          )}
        </Group>
        <UserSettingsForm />

        <Group wrap="nowrap" gap={10} mt={3}></Group>
      </Paper>
    </Container>
  );
};