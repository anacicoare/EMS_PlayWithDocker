import { ProfileContext } from "@/contexts/ProfileContext";
import { useContext, useEffect, useState } from "react";
import ManagerPayrollComponent from "@/contents/components/payroll/ManagerPayroll";
import EmployeePayrollComponent from "@/contents/components/payroll/EmployeePayroll";
import Header from "@/contents/components/header/Header";
import FooterEMS from "@/contents/components/footer/Footer";
import { ScrollArea } from "@mantine/core";
import { PaymentServices } from "@/services/payments/payments";
import { emitter } from "@/events/statusEmitter";

interface Payment {
  id: number;
  details: string;
  amount: number;
  month: string;
  year: number;
  recipient: string[];
  team: string[];
}

const PayrollPage = () => {
  const profile = useContext(ProfileContext);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      const response = await PaymentServices.getPayments();
      setPayments(response.data.payments);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // initial fetch on mount
    fetchPayments();

    // subscribe to the success event to re-run fetchPayments
    const handlePaymentSuccess = (message: string) => {
      console.log("Payment success event received:", message);
      fetchPayments();
    };

    emitter.on("success", handlePaymentSuccess);

    // cleanup subscription on unmount
    return () => {
      emitter.off("success", handlePaymentSuccess);
    };
  }, []);

  return (
    <>
      <Header />
      <ScrollArea className="flex-1 h-[calc(100vh-52px)] overflow-auto">
        <div className="p-10 px-20">
          {loading ? (
            <p>Loading payroll data...</p>
          ) : profile?.profile?.type === "manager" ? (
            <ManagerPayrollComponent payments={payments} setPayments={setPayments} />
          ) : (
            <EmployeePayrollComponent payments={payments} />
          )}
        </div>
        <FooterEMS />
      </ScrollArea>
    </>
  );
};

export default PayrollPage;
