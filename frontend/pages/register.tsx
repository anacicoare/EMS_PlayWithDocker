import {
    TextInput,
    PasswordInput,
    Paper,
    Title,
    Text,
    Container,
    Button,
    Divider,
    Box, Select
} from '@mantine/core';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from '@mantine/form';
import {useContext, useState} from 'react';
import { ProfileContext } from '@/contexts/ProfileContext';
import { useRouter } from 'next/router';
import bg from '../public/startpage_bg.jpg';
import {Simulate} from "react-dom/test-utils";
import select = Simulate.select;

/**
 * Login page
 * Use mantine form to validate
 */

const userTypes = [
    {value: 'employee', label: 'Employee'},
    {value: 'manager', label: 'Manager'},
]

export default function LoginPage() {
    const { register } = useContext(ProfileContext)
    const [selectedUserType, setSelectedUserType] = useState<string>('');
    const router = useRouter();

    const form = useForm({
        initialValues: { email: '', password: '', name: ''},

        // functions will be used to validate values at corresponding key
        validate: {
            email: (value) => {
                if (!value) {
                    return 'Email is required';
                }
                if (value !== '' && !value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
                    return 'Please enter a valid email address.';
                }
                return null;
            },
            password: (value) => {
                if (!value) {
                    return 'Password is required';
                }
                return null;
            },
            name: (value) => {
                if (!value) {
                    return 'Password is required';
                }
                return null;
            },
        },
    });

    const handleSubmit = (values: any) => {
        register({ email: values?.email, password: values?.password, user_type: selectedUserType, name: values?.name })
    }

    return (
        <div
            className='flex justify-center items-stretch position-absolute bg-cover bg-center bg-no-repeat w-screen h-screen'
            style={{backgroundImage: `url(${bg.src})`}}>
            <Box className='w-3/5 position-absolutess mt-10'>
                <Container size={470} my={40}>
                    <Paper withBorder shadow="md" p={20} mt={30} radius="md">
                        <h1 className='text-center'>Register now</h1>
                        <form noValidate onSubmit={form.onSubmit(handleSubmit)}>
                            <TextInput
                                autoFocus
                                name='name'
                                label="Full Name"
                                placeholder="Full Name"
                                required {...form.getInputProps('name')}
                                className={'mt-3'}
                            />
                            <TextInput
                                mt={'md'}
                                name='email'
                                label="Email"
                                placeholder="example@domain.com"
                                required {...form.getInputProps('email')}
                            />
                            <PasswordInput
                                label="Password"
                                name='password'
                                placeholder="Enter password"
                                required {...form.getInputProps('password')}
                                mt="md" />
                            <Select
                                data={userTypes}
                                label="User type"
                                placeholder="Select the type of the user"
                                value={selectedUserType}
                                onChange={(value: any) => setSelectedUserType(value)}
                                mt="md"
                            />
                            <Button variant="filled" color={'indigo.4'} type='submit' fullWidth mt="xl">
                                Register
                            </Button>
                            <Link href={'/login'}>
                                <Text className="-mb-3" size="sm" align="center" mt="md" variant="link">Already have an account? Log in</Text>
                            </Link>
                            <Link href={'/'}>
                                <Text className="-mb-3" size="sm" align="center" mt="md" variant="link">Back to home page</Text>
                            </Link>
                        </form>
                    </Paper>
                </Container>
            </Box>
        </div>
    );
}
