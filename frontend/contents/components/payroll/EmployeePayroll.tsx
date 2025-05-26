import PaymentTable from '@/contents/components/tables/PaymentTable';
import { Title } from '@mantine/core';
import { useContext, useEffect, useState } from 'react';
import { ProfileContext } from '@/contexts/ProfileContext';

interface EmployeePayrollComponentProps {
  payments: any[];
}

const EmployeePayrollComponent = ({ payments }: EmployeePayrollComponentProps) => {
  const [filteredPayments, setFilteredPayments] = useState<any[]>([]);
  const profile = useContext(ProfileContext);

  // Filter payments based on the current user's name
  useEffect(() => {
    if (profile?.profile?.name) {
      const filtered = payments
        .map((payment: any) => {
          // Retain only the current user's name in the recipient array
          const filteredRecipients = payment.recipient.filter(
            (name: string) => name === profile.profile.name
          );

          // Return payment if the user is a recipient
          if (filteredRecipients.length > 0) {
            return { ...payment, recipient: filteredRecipients };
          }

          return null;
        })
        .filter(Boolean);  // Remove null payments

      setFilteredPayments(filtered);
    } else {
      setFilteredPayments([]);
    }
  }, [payments, profile?.profile?.name]);

  return (
    <>
      <Title order={3} weight={'500'} className='mb-5' align='center'>
        Here you can find your payroll details
      </Title>
      <PaymentTable data={filteredPayments} />
    </>
  );
};

export default EmployeePayrollComponent;
