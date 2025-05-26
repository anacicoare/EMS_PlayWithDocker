import { Card, Text, Divider, Avatar } from '@mantine/core';

interface Member {
  name: string;
  date_joined: string;
  email: string;
  profile_picture: string;
}

export default function TeamMemberCard({ member }: { member: Member }) {
  return (
    <Card
      shadow="sm"
      padding="xl"
      radius="md"
      className="hover:shadow-xl hover:scale-120 transition-all duration-300 m-3"
      withBorder
    >
      <div className="flex flex-col items-center space-y-4">
        <Avatar
          src={member?.profile_picture ? member?.profile_picture : "https://st4.depositphotos.com/2546551/21188/v/450/depositphotos_211883696-stock-illustration-avatar-head-profile-silhouette-shadow.jpg"}
          alt={member.name}
          size="lg"
          radius="xl"
        />
        <div className="text-center w-full">
          <Text className="font-semibold text-lg mb-1">{member?.name}</Text>
          <Text className="font-light text-sm mb-2" color="dimmed">{member?.email}</Text>
          <Divider my="sm" />
          <Text color="dimmed" size="sm">
            Since {new Date(member.date_joined).toLocaleDateString()}
          </Text>
        </div>
      </div>
    </Card>
  );
}