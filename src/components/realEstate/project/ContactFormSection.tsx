"use client";

import React, { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import Link from "next/link";
import { ContactForm } from "./ContactForm";
import { useProjectContactForm } from "@/src/hooks/contact";

interface ContactFormSectionProps {
  locationRef: React.RefObject<HTMLDivElement>;
  wrapperRef: React.RefObject<HTMLDivElement>;
  propertyId: number;
  propertyName: string;
  toEmail: string;
  phoneNumber: string;
}

export function ContactFormSection({
  locationRef,
  wrapperRef,
  propertyId,
  propertyName,
  toEmail,
  phoneNumber,
}: ContactFormSectionProps) {
  const { name, email, phone, setName, setEmail, setPhone, isSubmitting, handleSubmit } =
    useProjectContactForm({
      propertyId,
      propertyName,
      toEmail,
    });

  const [formState, setFormState] = useState<"fixed" | "bottom" | "default">(
    "default"
  );
  const [formHeight, setFormHeight] = useState<number>(0);

  const formRef = useRef<HTMLDivElement>(null);
  const [isLargeScreen, setIsLargeScreen] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!isLargeScreen) {
      setFormState("default");
      return;
    }

    const handleScroll = () => {
      const formElement = formRef.current;
      const locationElement = locationRef.current;
      const wrapperElement = wrapperRef.current;

      if (!formElement || !locationElement || !wrapperElement) return;

      const scrollTop = window.scrollY;
      const wrapperTop = wrapperElement.offsetTop;
      const locationTop = locationElement.offsetTop;

      const breakPoint = locationTop - formElement.offsetHeight - 64;

      if (scrollTop >= breakPoint) {
        if (formState !== "bottom") {
          setFormState("bottom");
        }
        return;
      }

      if (scrollTop >= wrapperTop && scrollTop < breakPoint) {
        if (formState !== "fixed") {
          setFormHeight(formElement.offsetHeight);
          setFormState("fixed");
        }
        return;
      }

      if (scrollTop < wrapperTop) {
        if (formState !== "default") {
          setFormHeight(0);
          setFormState("default");
        }
        return;
      }
    };

    const onScroll = () => window.requestAnimationFrame(handleScroll);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [formState, isLargeScreen, locationRef, wrapperRef]);

  const formStyles = {
    fixed: "fixed top-32 right-11 w-96 z-10",
    bottom: "absolute bottom-0 right-11 w-96 z-0",
    default: "relative w-80 sm:w-96 mx-auto",
  };

  const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  return (
    <>
      {isLargeScreen && formState === "fixed" && (
        <div style={{ height: formHeight }} className="w-full" />
      )}

      <div
        ref={formRef}
        className={clsx(
          isLargeScreen ? formStyles[formState] : formStyles.default,
          "max-h-[80vh] overflow-y-auto rounded-lg border border-client-accent bg-[#F4F1ED] p-6"
        )}
      >
        <h2 className="mb-2 text-center text-2xl font-bold text-client-accent">
          Te llamamos
        </h2>

        {isDemo ? (
          <p className="mb-4 text-center text-sm leading-relaxed text-client-primary">
            Esta demo es informativa. Para consultar disponibilidad, utiliza
            WhatsApp o los canales públicos de Habitta.
          </p>
        ) : (
          <>
            <p className="mb-4 text-center text-sm text-client-primary">
              Déjanos tus datos y pronto estaremos en contacto.
            </p>

            <ContactForm
              name={name}
              email={email}
              phone={phone}
              setName={setName}
              setEmail={setEmail}
              setPhone={setPhone}
            />

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="mt-4 w-full rounded-md border py-2 font-semibold text-white bg-client-accentLight hover:bg-client-accentHover"
            >
              {isSubmitting ? "Enviando..." : "Contáctame"}
            </button>
          </>
        )}

        <Link
          href={`https://wa.me/57${phoneNumber.replace(
            /\D/g,
            ""
          )}?text=${encodeURIComponent(
            `Hola, estoy interesado en la propiedad "${propertyName}" con ID: ${propertyId}.`
          )}`}
          passHref
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center rounded-md border py-2 font-semibold text-white bg-green-500 hover:bg-green-600 transition"
        >
          Chatear por WhatsApp
        </Link>
      </div>
    </>
  );
}

