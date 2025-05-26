import { useState } from "react";
import { Card, Text, Badge, Divider, Avatar, ScrollArea } from "@mantine/core";
import TeamDetailModal from "./TeamDetailModal"; // Import your reusable modal

interface Team {
  id: number;           // ensure we have an ID field
  name: string;
  description: string;
  department: string;
  owner: string;
  members?: any[];  
}

export default function TeamCard({ team }: { team: Team }) {
  const [showModal, setShowModal] = useState(false);

  const handleCardClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      {/* 3D flip card */}
      <div className="perspective-1000 h-[300px] m-3" onClick={handleCardClick}>
        <div className="relative w-full h-full transition-transform duration-700 transform-style-preserve-3d hover:rotate-y-180">
          {/* Front of card */}
          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            className="absolute w-full h-full backface-hidden"
            withBorder
          >
            <div className="grid grid-rows-[auto_1fr] h-full gap-4">
              <div className="flex flex-col items-center gap-4">
                <Avatar size={64} radius="xl" color="blue" variant="filled">
                  {team.name.substring(0, 2).toUpperCase()}
                </Avatar>

                <Text
                  className="font-bold text-xl h-12 flex items-center justify-center text-center w-full pb-1"
                  variant="gradient"
                  gradient={{ from: "indigo", to: "lime", deg: 95 }}
                  style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                >
                  {team.name.split(" ").join("\n")} {/* Splits words with newline */}
                </Text>

                <Badge variant="light" color="blue" className="text-center -mb-4">
                  {team.department}
                </Badge>
              </div>

              <div className="mt-2">
                <Divider my="sm" />
                <ScrollArea style={{ height: 100 }}>
                  <Text color="dimmed" size="sm">
                    {team.description.length > 67
                      ? team.description.slice(0, 67) + "..."
                      : team.description}
                  </Text>
                </ScrollArea>
              </div>
            </div>
          </Card>

          {/* Back of card */}
          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            className="absolute w-full h-full backface-hidden rotate-y-180"
            withBorder
          >
            <div className="flex flex-col h-full">
              <div className="mb-4 flex flex-col items-center">
                <Text className="font-bold text-lg mb-4 text-center">Team Owner</Text>
                <Avatar
                  size={48}
                  radius="xl"
                  variant="gradient"
                  gradient={{ from: "indigo", to: "cyan", deg: 45 }}
                  className="mb-2 hover:opacity-90 transition-opacity"
                >
                  {team?.owner?.substring(0, 2).toUpperCase()}
                </Avatar>
                <Text className="text-center">{team?.owner}</Text>
              </div>

              <Divider my="sm" />

              <ScrollArea style={{ flex: 1 }}>
                <Text className="font-bold text-lg mb-2">Full Description</Text>
                <Text color="dimmed" size="sm">
                  {team.description}
                </Text>
              </ScrollArea>
            </div>
          </Card>
        </div>
      </div>

      {/* Modal for team details */}
      {showModal && (
        <TeamDetailModal
          isOpen={showModal}
          onClose={handleCloseModal}
          team={{...team,
            members: team.members ?? []

          }}
        />
      )}
    </>
  );
}
