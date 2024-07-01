'use client'

import { useState } from "react";
import LoginModal from "./modals/login";
import RegisterModal from "./modals/register";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/core/user/interfaces/userInterface";
import { Loading } from "./loading";

export function Header() {
  const [isOpenModalLogin, setIsOpenModalLogin] = useState(false);
  const [isOpenModalRegister, setIsOpenModalRegister] = useState(false);

  const handleGetUserData = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    const res = await fetch("/api/user/getUserByIdAuthenticated", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const { data }: { data: User } = await res.json();

    return data ? data : null;
  };

  const { data: userData, isLoading } = useQuery({
    queryKey: ['userData'],
    queryFn: handleGetUserData,
  })

  function formatName(fullName: string) {
    const separeteFullName = fullName.trim().split(' ');
    const firstName = separeteFullName[0];
    const lastName = separeteFullName.length > 1 ? " " + separeteFullName[separeteFullName.length - 1] : "";

    return firstName + lastName;
  }

  return (
    <>
      {isLoading && (
        <div className="flex justify-center items-center fixed top-0 left-0 z-50 w-screen h-screen bg-[#0d0d0d]">
          <Loading className="w-32 h-32" />
        </div>
      )}

      <header>
        <nav className="flex justify-between items-center border border-[#242424] bg-[#1e1e1e]/70 backdrop-blur-md px-4 py-2 rounded-md">
          <div className="p-2 px-2.5 text-xs select-none bg-secundary rounded-md inline-block"><code>&lt;&gt;</code></div>
          <div>
            {userData ?
              <div className="flex items-center">
                <div className="flex items-center mx-4 p-2 bg-[#111111]/70 border border-[#242424] rounded-lg shadow-md">
                  <h3 className="font-semibold text-gray-200">Olá, {formatName(userData.name)}.</h3>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    fetch('/api/expire', { method: 'POST' }).then(() => window.location.reload())
                  }}
                  className="hover:bg-[#ffffff1a] mr-2 text-white p-2 rounded-md select-none"
                >
                  Sair
                </button>
              </div>
              :
              <>
                <button type="button" onClick={() => setIsOpenModalLogin(true)} className="hover:bg-[#ffffff1a] mr-2 text-white p-2 rounded-md select-none">Entrar</button>
                <button type="button" onClick={() => setIsOpenModalRegister(true)} className="hover:bg-[#ffffff1a] text-white p-2 rounded-md select-none">Cadastrar</button>
              </>
            }
          </div>
        </nav>

        <LoginModal isOpen={isOpenModalLogin} onClose={() => setIsOpenModalLogin(false)} />
        <RegisterModal isOpen={isOpenModalRegister} onClose={() => setIsOpenModalRegister(false)} />

      </header>

      {!userData &&
        <div className="border border-[#242424] bg-[#1e1e1e]/70 p-4 mt-8 rounded-md">
          <h3>Login Necessário</h3>
          <p className="text-gray-400 mt-2">Para que suas tarefas sejam salvas, é necessário estar logado. Por favor, faça login para continuar.</p>
        </div>
      }
    </>
  )
}