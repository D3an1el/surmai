import {Button, Container, Notification, Paper, Text, TextInput} from '@mantine/core';
import {useForm} from "@mantine/form";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {createUserWithPassword} from "../../lib";
import {useTranslation} from "react-i18next";
import {FancyPasswordInput} from "../../components/account/FancyPasswordInput.tsx";

export const SignUp = () => {


  const [apiError, setApiError] = useState<string>()
  const navigate = useNavigate()
  const {t} = useTranslation()
  const createAccount = async (values: {
    email: string;
    fullName: string;
    password: string;
    confirmPassword?: string;
  }) => {
    const {email, password, fullName} = values;
    createUserWithPassword({email, name: fullName, password, passwordConfirm: password || ''})
      .then(() => {
        navigate("/login")
      }).catch(err => setApiError(err.message))
  }

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      fullName: '',
      password: '',
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : t('account.invalid_email', 'Invalid email')),
    },
  });


  // const strength = getStrength(form.getValues().password);
  // const color = strength === 100 ? 'teal' : strength > 50 ? 'yellow' : 'red';
  //
  // const checks = passwordRequirements.map((requirement, index) => (
  //   <PasswordRequirement key={index} label={requirement.label} meets={requirement.re.test(currentPasswordValue)}/>
  // ));

  // form.watch('password', ({ previousValue, value, touched, dirty }) => {
  //   setCurrentPasswordValue(value)
  // })


  return (<>
    <Container size={420} my={40}>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md" bg="var(--mantine-color-blue-light)">

        <Text size="lg" ta="center" mt={5}>
          {t('create_account', 'Create An Account')}
        </Text>

        {apiError && <Notification withBorder color="red"
                                   title={t('account_creation_failed', 'Unable to create an account')}
                                   onClose={() => setApiError(undefined)}>
          {apiError}
        </Notification>}

        <form onSubmit={form.onSubmit((values) => createAccount(values))}>
          <TextInput label={t('name', "Name")} placeholder="" mt={"md"} required
                     key={form.key('fullName')} {...form.getInputProps('fullName')}/>
          <TextInput label={t('email', 'Email')} placeholder="you@domain.com" mt={"md"} required
                     key={form.key('email')} {...form.getInputProps('email')}/>

          {// @ts-expect-error rest props
            <FancyPasswordInput fieldName={'password'} form={form} withAsterisk={true} label={t('password', 'Password')}
                                required mt="md"/>
          }

          <Button fullWidth mt="xl" type={"submit"}>
            {t('create_account', 'Create An Account')}
          </Button>

        </form>

      </Paper>
    </Container>
  </>)
}