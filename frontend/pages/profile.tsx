import React, { useContext, useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { Card, Text, Button, Avatar, FileButton } from '@mantine/core';
import { Camera, Mail, User, Shield } from 'lucide-react';
import { ProfileServices } from '@/services/profile/profile';
import { ProfileContext } from '@/contexts/ProfileContext';
import { useRouter } from 'next/router';

// Define the type for userData
interface UserData {
  name: string;
  email: string;
  profile_picture?: string;
  is_admin?: boolean;
  type: 'manager' | 'user';
}

export default function ProfilePage() {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [avatar, setAvatar] = useState<string>('user.png');
    const [isUploading, setIsUploading] = useState(false);
    const profile = useContext(ProfileContext);
    const router = useRouter();

    useEffect(() => {
        if (profile?.profile?.email) {
            ProfileServices.callApiGetUserData(profile.profile.email)
                .then((response: any) => {
                    if (response?.data) {
                        setUserData(response.data);
                        if (response.data?.profile_picture) {
                            setAvatar(response.data?.profile_picture);
                        }
                    }
                })
                .catch((error) => {
                    console.error("Error fetching user data:", error);
                });
        }
    }, [profile?.profile?.email]);

    const handleFileChange = async (file: File | null) => {
        if (!file) {
            console.log("No file selected");
            return;
        }

        try {
            setIsUploading(true);

            const formData = new FormData();
            formData.append('file', file);
            
            const response = await ProfileServices.callApiUpdateProfilePicture(formData);
            
            if (response?.data?.url) {
                setAvatar(response.data.url);
                // Update `setUserData` to handle `undefined` name values
                setUserData(prev => ({
                    ...prev,
                    profile_picture: response.data.url,
                    name: prev?.name ?? '', // Ensure name is always a string
                    email: prev?.email ?? '', // Ensure email is a string
                    is_admin: prev?.is_admin ?? false, // Default to false if is_admin is undefined
                    type: prev?.type ?? 'user', // Default to 'user' if type is undefined
                }));

            }
        } catch (error) {
            console.error("Error uploading profile picture:", error);
            if (userData?.profile_picture) {
                setAvatar(userData.profile_picture);
            }
        } finally {
            setIsUploading(false);
        }
    };

    // Rest of the component remains the same...
    const InfoRow = ({ icon: Icon, label, value }: { icon: any, label: string, value?: string }) => (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
        >
            <Icon className="text-gray-500" size={24} />
            <div className="flex-1">
                <Text size="sm" color="dimmed">{label}</Text>
                <Text size="lg" weight={500}>{value || 'Not specified'}</Text>
            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screen relative bg-gray-50">
            <div 
                className="h-48 w-full relative overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)'
                }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 1.2 }}
                    animate={{ opacity: 0.1, scale: 1 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0"
                    style={{
                        backgroundSize: 'cover',
                        mixBlendMode: 'overlay'
                    }}
                />
            </div>

            <motion.div 
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-x-0 top-16 flex justify-center px-4"
            >
                <Card shadow="lg" radius="lg" className="w-full max-w-2xl">
                    <div className="relative flex flex-col items-center">
                        <div className="relative group">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="relative"
                            >
                                <Avatar 
                                    src={avatar} 
                                    size={120} 
                                    radius={120} 
                                    className="border-4 border-white shadow-lg"
                                />
                                <FileButton 
                                    onChange={handleFileChange} 
                                    accept="image/png,image/jpeg"
                                    disabled={isUploading}
                                >
                                    {(props) => (
                                        <Button 
                                            {...props}
                                            variant="filled" 
                                            size="xs"
                                            loading={isUploading}
                                            className="absolute bottom-0 right-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Camera size={14} />
                                        </Button>
                                    )}
                                </FileButton>
                            </motion.div>
                        </div>

                        <div className="mt-4 flex items-center gap-2">
                            <Text size="xl" weight={700}>{userData?.name}</Text>
                            {userData?.is_admin && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 500, delay: 0.2 }}
                                >
                                    <Shield className="text-indigo-500" size={20} />
                                </motion.div>
                            )}
                        </div>

                        <div className="w-full mt-6 space-y-2 flex flex-col justify-center items-center">
                            <InfoRow icon={User} label="Name" value={userData?.name} />
                            <InfoRow icon={Mail} label="Email" value={userData?.email} />
                            <InfoRow icon={Shield} label="Account Type" value={userData?.type == 'manager' ? 'Manager' : 'Standard User'} />
                        </div>

                        <motion.div 
                            className="w-full flex justify-end mt-6 pt-6 border-t flex flex-col items-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Button
                                variant="gradient"
                                size="md"
                                onClick={() => router.push('/teams')}
                                style={{
                                    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)'
                                }}
                            >
                                Continue to Teams
                            </Button>
                        </motion.div>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}
