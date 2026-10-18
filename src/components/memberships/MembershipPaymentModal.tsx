"use client";

import { useEffect, useState } from "react";
import type { Membership } from "@/src/interfaces";
import { EpaycoButton } from "@/src/components/memberships";
import { formatNumber } from "@/utils/formatters";

interface MembershipPaymentModalProps {
  membership: Membership;
  isOpen: boolean;
  onClose: () => void;
}

export function MembershipPaymentModal({
  membership,
  isOpen,
  onClose,
}: MembershipPaymentModalProps) {
  const [months, setMonths] = useState<number | null>(null);
  const [finalPrice, setFinalPrice] = useState<number>(0);
  const [base, setBase] = useState<number>(0);

  useEffect(() => {
    if (months === null) {
      setFinalPrice(0);
      return;
    }

    const subtotal = membership.price * months;

    let discount = 0;
    if (months === 3) discount = membership.discountThreeMonths ?? 0;
    else if (months === 6) discount = membership.discountSixMonths ?? 0;
    else if (months === 12) discount = membership.discountTwelveMonths ?? 0;

    const totalWithDiscount = subtotal - (subtotal * discount) / 100;

    setFinalPrice(parseFloat((totalWithDiscount * 1.19).toFixed(2)));
    setBase(parseFloat(totalWithDiscount.toFixed(2)));
  }, [months, membership]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-lg">
        <h3 className="text-xl font-bold text-center mb-4 text-client-primary">
          Comprar membresía {membership.name}
        </h3>

        <div className="mb-4">
          <label
            htmlFor="selectMounth"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Selecciona la duración:
          </label>

          <select
            id="selectMounth"
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            value={months ?? ""}
            onChange={(e) => setMonths(Number(e.target.value))}
          >
            {!months && <option value="">Selecciona una opción</option>}
            <option value={1}>1 mes</option>
            <option value={3}>3 meses</option>
            <option value={6}>6 meses</option>
            <option value={12}>12 meses</option>
          </select>
        </div>

        {months && (
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600">
              Total a pagar (IVA incluido):{" "}
              <span className="font-semibold text-client-primary">
                ${formatNumber(finalPrice)}
              </span>
            </p>
          </div>
        )}

        {months && (
          <div className="flex justify-center">
            <EpaycoButton
              amount={finalPrice}
              tax={finalPrice - base}
              taxBase={base}
              name={`Membresía ${membership.name}`}
              description={`${months} mes(es) de membresía`}
            />
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-6 w-full bg-client-accent text-client-text rounded-lg py-2 hover:bg-client-accentHover"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
