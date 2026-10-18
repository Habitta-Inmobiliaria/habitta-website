"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { UserProfile, Gender } from "@/src/interfaces";
import { useUserProfile, useUpdateUserProfile } from "@/src/hooks/user";
import { useChangePassword } from "@/src/hooks/auth";
import { useLoading, useClientConfirmation } from "@/src/providers";
import { Alert } from "@/src/components/shared";
import { ModalChangePassword } from "./ModalChangePassword";

const ProfileForm = dynamic(
  () => import("./ProfileForm").then((mod) => mod.ProfileForm),
  {
    ssr: false,
  },
);

interface ProfileUpdateInput {
  identityDocument?: string;
  names?: string;
  lastnames?: string;
  birthdate?: Date | null;
  phoneNumber?: string;
  genderId?: number | null;
}

export function ClientProfilePage() {
  const { user, genders, loading, error } = useUserProfile();
  const [userState, setUserState] = useState<UserProfile | null>(user);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const { showLoader, hideLoader } = useLoading();
  const confirm = useClientConfirmation();

  useEffect(() => {
    if (user) setUserState(user);
  }, [user]);

  const {
    updateUserProfile,
    error: updateError,
    success,
  } = useUpdateUserProfile();

  const {
    changePassword,
    error: changePasswordError,
    success: passwordSuccess,
  } = useChangePassword();

  const openPasswordModal = () => {
    setShowChangePasswordModal(true);
  };

  const handleSubmitRequest = async (data: ProfileUpdateInput) => {
    const confirmed = await confirm({
      title: "Confirmar actualizaci?n",
      message: "¿Estás seguro de que deseas actualizar tus datos personales?",
      confirmLabel: "Confirmar",
      cancelLabel: "Cancelar",
      confirmClassName: "bg-client-accent hover:bg-client-accentHover",
    });

    if (!confirmed) return;

    showLoader();

    try {
      const success = await updateUserProfile(data);
      if (success) {
        const { genderId, birthdate, ...rest } = data;
        const nextGender = genderId
          ? genders.find((gender) => gender.id === genderId)
          : undefined;
        setUserState((prev) =>
          prev
            ? {
                ...prev,
                ...rest,
                birthdate: birthdate ?? prev.birthdate,
                gender: nextGender ?? prev.gender,
              }
            : prev,
        );
      }
    } finally {
      hideLoader();
    }
  };

  const handlePasswordChange = async (data: {
    currentPassword: string;
    newPassword: string;
  }) => {
    if (!user) return;

    setShowChangePasswordModal(false);

    const confirmed = await confirm({
      title: "Confirmar actualización",
      message: "¿Estás seguro de que deseas actualizar tus datos personales?",
      confirmLabel: "Confirmar",
      cancelLabel: "Cancelar",
      confirmClassName: "bg-client-accent hover:bg-client-accentHover",
    });

    if (!confirmed) return;

    showLoader();

    try {
      await changePassword(data);
    } finally {
      hideLoader();
    }
  };

  return (
    <section className="w-full py-10">
      <div className="max-w-4xl mx-auto px-4">
        {success && (
          <Alert type="success" message="Datos actualizados correctamente" />
        )}

        {updateError && <Alert type="error" message={updateError} />}

        {changePasswordError && (
          <Alert type="error" message={changePasswordError} />
        )}

        {passwordSuccess && (
          <Alert
            type="success"
            message="Contraseña actualizada correctamente"
          />
        )}

        <div className="bg-client-backgroundAlt p-10 rounded-2xl shadow my-12">
          <h2 className="text-3xl mb-8 font-bold text-center text-client-text">
            Mi perfil
          </h2>

          {loading && (
            <p className="text-center text-client-text">Cargando perfil...</p>
          )}
          {error && <p className="text-center text-red-500">Error: {error}</p>}

          {user && (
            <div className="relative">
              {userState && (
                <ProfileForm
                  user={userState}
                  genders={genders as Gender[]}
                  onSubmitRequest={handleSubmitRequest}
                />
              )}

              <div className="col-span-1 md:col-span-2 mt-4">
                <button
                  type="button"
                  onClick={openPasswordModal}
                  className="w-full rounded-md bg-client-text text-client-primary py-2 font-semibold hover:bg-client-textPlaceholder transition"
                >
                  Cambiar contraseña
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ModalChangePassword
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
        onConfirmRequest={handlePasswordChange}
      />
    </section>
  );
}
