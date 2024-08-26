"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PlanType } from "@/enums/plan";
import useAuthCheck from "../../../hooks/use-auth-check";
import { getUserPaymentStatus } from "../../../actions/payment";
import { useCurrentUser } from "../../../hooks/use-current-user";

const PaymentPage = () => {
  const router = useRouter();
  useAuthCheck();
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const actualUser = useCurrentUser();

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      try {
        const { status, daysRemaining } = await getUserPaymentStatus(actualUser.id);
        setPaymentStatus(status);
        setDaysRemaining(daysRemaining);
      } catch (error) {
        console.error("Erro ao buscar status de pagamento:", error);
        setPaymentStatus("Erro ao buscar status");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentStatus();
  }, [actualUser.id]);

  const handlePlanSelection = (planType: PlanType) => {
    router.push(`/payment/${planType}`);
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Situação do Pagamento</h1>
      {paymentStatus === "Sem Pagamento" && (
        <div className="p-4 mb-6 bg-gray-500 text-white rounded-lg">
          <p>Nenhum pagamento registrado. Por favor, escolha um plano abaixo.</p>
        </div>
      )}
      {paymentStatus === "Usuário não encontrado" && (
        <div className="p-4 mb-6 bg-gray-500 text-white rounded-lg">
          <p>Usuário não encontrado. Por favor, verifique suas informações.</p>
        </div>
      )}
      {paymentStatus === "Erro ao buscar status" && (
        <div className="p-4 mb-6 bg-red-600 text-white rounded-lg">
          <p>Ocorreu um erro ao buscar o status de pagamento. Tente novamente mais tarde.</p>
        </div>
      )}
      {paymentStatus === "Pago" && (
        <div className="p-4 mb-6 bg-green-500 text-white rounded-lg">
          <p>Status: {paymentStatus}</p>
          {daysRemaining !== null && <p>Tempo Restante: {daysRemaining} dias</p>}
        </div>
      )}
      {paymentStatus === "Vencido" && (
        <div className="p-4 mb-6 bg-red-600 text-white rounded-lg">
          <p>Status: {paymentStatus}</p>
          <p>Seu plano está vencido. Por favor, realize o pagamento para continuar.</p>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md mb-6"
            onClick={() => handlePlanSelection(PlanType.NORMAL)}
          >
            Pagar Agora
          </button>
        </div>
      )}
      {paymentStatus === "A Vencer em Breve" && (
        <div className="p-4 mb-6 bg-yellow-500 text-white rounded-lg">
          <p>Status: {paymentStatus}</p>
          <p>Tempo Restante: {daysRemaining} dias</p>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md mb-6"
            onClick={() => handlePlanSelection(PlanType.NORMAL)}
          >
            Pagar Agora
          </button>
        </div>
      )}
      {paymentStatus !== "Pago" && (
        <div>
          <h1 className="text-3xl font-bold mb-6">Escolha seu Plano</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Plano Normal */}
            <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">Plano Normal</h2>
              <p className="text-4xl font-bold mb-4">R$100 / mês</p>
              <ul className="mb-4">
                {/* Benefícios do plano */}
                <li className="flex items-center mb-2">✓ Acesso às máquinas de musculação</li>
                <li className="flex items-center mb-2">✓ Aulas de ginástica</li>
                <li className="flex items-center mb-2">✓ Aulas de spinning</li>
                <li className="flex items-center mb-2">✗ Personal Trainer</li>
                <li className="flex items-center mb-2">✗ Acesso à sauna</li>
                <li className="flex items-center mb-2">✗ Nutricionista</li>
              </ul>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
                onClick={() => handlePlanSelection(PlanType.NORMAL)}
              >
                Escolher Plano Normal
              </button>
            </div>
            {/* Plano VIP */}
            <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">Plano VIP</h2>
              <p className="text-4xl font-bold mb-4">R$200 / mês</p>
              <ul className="mb-4">
                {/* Benefícios do plano VIP */}
                <li className="flex items-center mb-2">✓ Acesso às máquinas de musculação</li>
                <li className="flex items-center mb-2">✓ Aulas de ginástica</li>
                <li className="flex items-center mb-2">✓ Aulas de spinning</li>
                <li className="flex items-center mb-2">✓ Personal Trainer</li>
                <li className="flex items-center mb-2">✓ Acesso à sauna</li>
                <li className="flex items-center mb-2">✓ Nutricionista</li>
              </ul>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
                onClick={() => handlePlanSelection(PlanType.VIP)}
              >
                Escolher Plano VIP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
