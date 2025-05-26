import PaymentTable from '@/contents/components/tables/PaymentTable';
import { ProfileContext } from '@/contexts/ProfileContext';
import { PaymentServices } from '@/services/payments/payments';
import { TeamsServices } from '@/services/teams/teams';
import { Button, Drawer, MultiSelect, Select, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { useState, useEffect, use, useContext } from 'react';
import { emitter } from '@/events/statusEmitter';
import { set } from 'lodash';

interface ManagerPayrollComponentProps {
  payments: any[];
  setPayments: any;
}

const ManagerPayrollComponent = ({ payments }: ManagerPayrollComponentProps) => {

  const [userColleagues, setUserColleagues] = useState<string[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);

  const profile = useContext(ProfileContext);

  // Fetch user colleagues on component mount
  useEffect(() => {
    const fetchColleagues = async () => {
      try {
        const response = await TeamsServices.getUserColleagues();
        setUserColleagues(response.data.map((colleague: any) => colleague.name));
      } catch (error) {
        console.error('Failed to fetch user colleagues:', error);
      }
    };

    const fetchTeams = async () => {
      try {
        const response = await TeamsServices.getTeams();
        setTeams(response.data.teams.filter((team: any) => team.owner === profile?.profile?.name));
      } catch (error) {
        console.error('Failed to fetch teams:', error);
      }
    }

    fetchColleagues();
    fetchTeams(); 
  }, []);

  // Filter and modify payments when payments or userColleagues change
   useEffect(() => {
    if (userColleagues.length > 0) {
      const filtered = payments
        .map((payment: any) => {
          // Get the intersection of payment.recipient and userColleagues
          const filteredRecipients = payment?.recipient?.filter((name: string) =>
            userColleagues.includes(name) || name === profile?.profile?.name
          );

          // Return payment only if it has at least one valid recipient
          if (filteredRecipients?.length > 0) {
            return { ...payment, recipient: filteredRecipients };
          }

          return null;
        })
        .filter(Boolean);  // Remove null payments

      console.log('Filtered payments:', filtered);
      
      setFilteredPayments(filtered);
    } else {
      setFilteredPayments([]);
    }
  }, [payments, userColleagues]);

  const [opened, { open, close }] = useDisclosure(false);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);

  const form = useForm({
    initialValues: {
      team_id: 0,
      user_ids: [],
      amount: 0,
      details: ''
    },
  });

  return (
    <>
      <Drawer
        opened={opened}
        onClose={close}
        title="Submit new payment"
        position='right'
        overlayProps={{ opacity: 0.5, blur: 4 }}
      >
        <form onSubmit={form.onSubmit((values) => {
          console.log('Submitted values:', values);
          close();

          // Send the payment to the backend
          PaymentServices.createPayment(values).then((response) => {
            console.log('Payment created:', response.data);
            emitter.emit('success', 'Payment created successfully!');
          }).catch((error) => {
            console.error('Failed to create payment:', error);
          });
        })}>
          <TextInput
            placeholder="Enter the value as a number"
            className='mt-5'
            label="Amount"
              withAsterisk
              {...form.getInputProps('amount')}
          />
          <TextInput
            placeholder="Describe the payment details"
            className='mt-5'
            label="Payment details"
              withAsterisk
              {...form.getInputProps('details')}
          />
          <Select
            label="Team"
            className='mt-5'
            placeholder="Pick one"
            data={teams.map((team: any) => ({ value: team.id, label: team.name }))}
            withAsterisk
            {...form.getInputProps('team_id')}
          />
          <MultiSelect
              data= {
                teams.filter((team: any) => team.id === form.values.team_id)[0]?.members.map((member: any) => ({
                value: member.id,
                label: member.name
                })) || []
              }

            label="The recipients of the payment"
            placeholder="Pick all that you like"
            className='mt-5'
              withAsterisk
              {...form.getInputProps('user_ids')}
          />

          <Button
            className='absolute bottom-5 right-5'
            type="submit"
          >
            Submit
          </Button>
        </form>
      </Drawer>
      <Button onClick={open} className='absolute'>
        Add new payment
      </Button>
      <Title order={3} weight={'500'} className='mb-5' align='center'>
        Here you can find the payroll details of the teams you manage
      </Title>
      <PaymentTable data={filteredPayments} />
    </>
  );
};

export default ManagerPayrollComponent;
