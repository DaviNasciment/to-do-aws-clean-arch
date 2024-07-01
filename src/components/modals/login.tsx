'use client'

import Image from 'next/image'

import { useEffect, useRef, useState } from 'react';
import { HiAtSymbol, HiFingerPrint, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';

import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { userMakeService } from '@/modules/user/factories/userMakeService';

interface ILoginModal {
    isOpen: boolean;
    onClose: () => void;
}

const createLoginSchema = z.object({
    email: z.string(),
    password: z.string(),
})

type CreateLoginSchema = z.infer<typeof createLoginSchema>

const LoginModal = ({ isOpen, onClose }: ILoginModal) => {
    const modalRef: React.RefObject<HTMLDivElement> = useRef(null);
    const userService = userMakeService();

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState<null | string>(null);
    const [isShowingPassword, setIsShoshowingPassword] = useState(false);

    const { register, handleSubmit, formState } = useForm<CreateLoginSchema>({
        resolver: zodResolver(createLoginSchema)
    })
    const { isSubmitting } = formState;

    const handleClickOutside = (e: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    async function handleLoginUser(data: CreateLoginSchema) {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        try {
            await userService.authUser(data.email, data.password);

            setError(null);
            setSuccess("Conta logada com sucesso.")
        } catch (error: any) {
            console.error("Error registering user:", error);
            setSuccess(null)
            setError(error.message);
        }
    }

    return (
        <div
            className={`fixed inset-0 flex items-center justify-center z-50 ${isOpen ? 'block' : 'hidden'
                }`}
        >
            <div className="fixed inset-0 bg-[#00000054] opacity-50"></div>
            <div ref={modalRef} className="rounded-lg max-w-sm z-10 w-full">
                {/* <!-- Modal content --> */}
                <div className="relative bg-[#1e1e1e] rounded-lg shadow w-full">
                    {/* <!-- Modal header --> */}
                    <div className="flex items-start justify-between rounded-t">
                        <h3 className="text-lg font-medium text-gray-600">
                            <Image
                                src="/images/colorful-unsplash.jpg"
                                width={600}
                                height={500}
                                alt="Picture of the author"
                                className="rounded-t"
                            />
                        </h3>
                    </div>
                    {/* <!-- Modal body --> */}
                    <div className="p-6 w-full">
                        <form
                            onSubmit={handleSubmit(handleLoginUser)}
                            className="text-base leading-relaxed text-white w-full"
                        >
                            <h3 className="font-bold mt-12 mb-8">Bem vindo ao Tasks</h3>

                            <label className="bg-[#353535] border border-[#1e1e1e] focus-within:border-secundary rounded-md px-4 py-2 transition-all flex items-center" htmlFor="email-login">
                                <span className="mr-2"><HiAtSymbol className="text-gray-400" /></span>
                                <input
                                    id="email-login"
                                    type="email"
                                    className="w-full outline-none placeholder:text-gray-400 bg-transparent appearance-none"
                                    placeholder="fulano@gmail.com"
                                    {...register('email')}
                                />
                            </label>

                            <label className="mt-4 bg-[#353535] border border-[#1e1e1e] focus-within:border-secundary rounded-md px-4 py-2 transition-all flex items-center" htmlFor="password-login">
                                <span className="mr-2"><HiFingerPrint className="text-gray-400" /></span>
                                <input
                                    id="password-login"
                                    type={!isShowingPassword ? "password" : "text"}
                                    className="w-full outline-none placeholder:text-gray-400 bg-transparent"
                                    placeholder="••••••••••••"
                                    {...register('password')}
                                />
                                <span onClick={() => setIsShoshowingPassword(!isShowingPassword)} className="text-gray-400 ml-2">
                                    {isShowingPassword ? <HiOutlineEye /> : <HiOutlineEyeOff />}
                                </span>
                            </label>

                            <button disabled={isSubmitting} type="submit" className={`select-none hover:bg-transparent border border-secundary rounded-md px-4 py-2 mt-12 mb-4 w-full transition-all ${isSubmitting ? "bg-transparent" : "bg-secundary"}`}>
                                <span>{isSubmitting ? 'Carregando...' : 'Entrar'}</span>
                            </button>

                            {error && <div className="text-[#721c24] bg-[#f8d7da] border border-[#f5c6cb] rounded-sm px-4 py-2">{error}</div>}
                            {success && <div className="text-[#155724] bg-[#d4edda] border border-[#c3e6cb] rounded-sm px-4 py-2">{success}</div>}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
