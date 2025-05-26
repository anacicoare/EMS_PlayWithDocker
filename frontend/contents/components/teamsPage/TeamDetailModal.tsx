import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button, Text, TextInput, Textarea, MultiSelect } from "@mantine/core";
import { TeamsServices } from "@/services/teams/teams";
import { ProfileServices } from "@/services/profile/profile";
import { ProfileContext } from "@/contexts/ProfileContext";

type Member = {
  id: number;
  name: string;
};

type Team = {
  id: number;
  name: string;
  description: string;
  members: Member[];
};

export default function TeamDetailModal({
  isOpen,
  onClose,
  team,
}: {
  isOpen: boolean;
  onClose: () => void;
  team: Team;
}) {
  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [memberOptions, setMemberOptions] = useState<any[]>([]);

    const {profile} = useContext(ProfileContext);

  useEffect(() => {
    if (team) {
      setTeamName(team.name ?? "");
      setDescription(team.description ?? "");
      // Convert member IDs to strings for MultiSelect
      setSelectedMembers(team.members?.map(m => String(m.id)) ?? []);
    }
  }, [team]);

    useEffect(() => {
        ProfileServices.getAllUsers().then((response) => {
            //console.log("All users:", response.data);
            const allUsers = response.data;
            const allMemberOptions = allUsers?.users?.map((user: any) => ({
                value: String(user.id),
                label: user.name,
            }));
            setMemberOptions(allMemberOptions);
        }).catch((error) => {
            console.error("Error fetching all users:", error);
        });
    }, []);

  const handleUpdateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!team?.id) return;

    try {
      const payload = {
        id: team.id,
        name: teamName,
        description: description,
        members: selectedMembers.map(memberId => Number(memberId)),
      };

      const response = await TeamsServices.updateTeam(payload);
      console.log("Updated team response:", response);

      const event = new Event("TEAM_UPDATED");
      window.dispatchEvent(event);

      onClose();
    } catch (error) {
      console.error("Error updating team:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose}
      key={team?.id}
    >
      <motion.div
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col md:flex-row w-10/12 md:w-8/12 lg:w-6/12 bg-white rounded-lg overflow-hidden shadow-lg"
      >
        <div
          className="hidden md:flex flex-col justify-center items-center w-1/2 p-6"
          style={{
            background: "linear-gradient(135deg, rgb(255, 255, 255) 0%, rgb(167, 195, 255) 300%)",
          }}
        >
          <img
            src="/create_teams_illustration.png"
            alt="Team Detail Illustration"
            className="max-w-full h-auto"
          />
        </div>

        <div className="w-full md:w-1/2 p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            {teamName || "Team Details"}
          </h2>
          <Text c="dimmed" className="mb-4">
            Update team details below.
          </Text>

          <form onSubmit={handleUpdateTeam}>
            <label className="block mb-2 text-gray-700">Team Name</label>
            <TextInput
              value={teamName}
              onChange={(e) => setTeamName(e.currentTarget.value)}
              placeholder="e.g. Marketing Team"
                className="mb-4"
                disabled={profile?.type === "employee"} // Disable if not manager
              required
            />

            <label className="block mb-2 text-gray-700">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
                          placeholder="Brief description of the team"
                          disabled={profile?.type == "employee"} // Disable if not manager
              autosize
              minRows={2}
              className="mb-4"
            />

            <label className="block mb-2 text-gray-700">Team Members</label>
            <MultiSelect
              data={memberOptions}
              placeholder="Pick team members"
              value={selectedMembers}
              onChange={setSelectedMembers}
              searchable
                          nothingFound="No users found"
                          disabled={profile?.type == "employee"} // Disable if not manager
              className="mb-4"
            />

           {profile?.type != "employee" &&  <div className="flex items-center space-x-2 mt-6">
              <Button type="submit" color="blue">
                Save Changes
              </Button>
              <Button variant="outline" color="gray" onClick={onClose}>
                Cancel
              </Button>
            </div>}
          </form>
        </div>
      </motion.div>
    </div>
  );
}