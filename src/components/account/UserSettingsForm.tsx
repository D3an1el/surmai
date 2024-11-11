import { useCurrentUser } from '../../auth/useCurrentUser.ts';
import { useForm } from '@mantine/form';
import { UserSettingsFormType } from '../../types/auth.ts';
import { Box, Button, Group, TextInput } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { ColorSchemeSelect } from './ColorSchemeSelect.tsx';
import { useContext } from 'react';
import { SurmaiContext } from '../../app/Surmai.tsx';

export const UserSettingsForm = () => {
  const { user } = useCurrentUser();
  const { t } = useTranslation();

  const appCtx = useContext(SurmaiContext);

  const initialValues: UserSettingsFormType = {
    name: user?.name,
    colorScheme: user?.colorScheme,
    currencyCode: user?.currencyCode,
  };

  const form = useForm<UserSettingsFormType>({
    mode: 'uncontrolled',
    initialValues: initialValues,
  });

  const handleSubmission = (values: UserSettingsFormType) => {
    console.log(values);

    appCtx.changeColor?.(values.colorScheme);

    // mantineTheme.primaryColor = "green"
  };

  return (
    <Box mt={'sm'}>
      <form onSubmit={form.onSubmit(handleSubmission)}>
        <TextInput
          mt={'sm'}
          name={'name'}
          label={t('change_name', 'Name')}
          required
          key={form.key('name')}
          {...form.getInputProps('name')}
        />

        <ColorSchemeSelect
          formKey={form.key('colorScheme')}
          formProps={{ ...form.getInputProps('colorScheme') }}
        />

        <Group justify={'flex-end'}>
          <Button mt="xl" type={'submit'}>
            {t('save', 'Save')}
          </Button>
        </Group>
      </form>
    </Box>
  );
};
