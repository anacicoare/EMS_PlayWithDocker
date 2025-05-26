import { Box, Container, Text } from "@mantine/core";
import { useEffect } from "react";
import { emitter } from "@/events/statusEmitter";

export default function TaskStatusBar(props: any) {
    const { team, setTeam } = props;

    useEffect(() => {
        const handler = (updatedTask: any) => {
            // Update team state based on updatedTask
            setTeam((prevTeam: any) => {
                const updatedMembers = prevTeam.members.map((member: any) => {
                    const updatedTasks = member.tasks.map((task: any) =>
                        task.id === updatedTask.id ? updatedTask : task
                    );
                    return { ...member, tasks: updatedTasks };
                });
                return { ...prevTeam, members: updatedMembers };
            });
        };

        emitter.on("taskUpdated", handler);
        return () => {
            emitter.off("taskUpdated", handler);
        };
    }, [setTeam]);

    const todoCount =
        team?.members?.reduce((acc: number, member: any) => {
            const memberTodo = member?.tasks?.filter(
                (task: any) => task?.status === "TO DO"
            ).length || 0;
            return acc + memberTodo;
        }, 0) || 0;
    
    const inprogressCount =
        team?.members?.reduce((acc: number, member: any) => {
            const memberTodo = member?.tasks?.filter(
                (task: any) => task?.status === "IN PROGRESS"
            ).length || 0;
            return acc + memberTodo;
        }, 0) || 0;
    
    const doneCount =
        team?.members?.reduce((acc: number, member: any) => {
            const memberTodo = member?.tasks?.filter(
                (task: any) => task?.status === "DONE"
            ).length || 0;
            return acc + memberTodo;
        }, 0) || 0;

    return (
        <Container className="py-8" size={"xl"}>
            <h2 className="text-slate-700">{team?.name}</h2>
            <div className="flex flex-row space-x-4">
                <Box className="bg-slate-100 p-4 rounded-md w-[300px] shadow-sm">
                    <div className="flex flex-row">
                        <Text className="text-slate-800">TO DO</Text>
                        <Text className="text-indigo-700 font-semibold ml-2">
                            {todoCount}
                        </Text>
                    </div>
                </Box>
                <Box className="bg-slate-100 p-4 rounded-md w-[300px] shadow-sm">
                    <div className="flex flex-row">
                        <Text className="text-slate-800">IN PROGRESS</Text>
                        <Text className="text-blue-700 font-semibold ml-2">{inprogressCount}</Text>
                    </div>
                </Box>
                <Box className="bg-slate-100 p-4 rounded-md w-[300px] shadow-sm">
                    <div className="flex flex-row">
                        <Text className="text-slate-800">DONE</Text>
                        <Text className="text-green-700 font-semibold ml-2">{doneCount}</Text>
                    </div>
                </Box>
            </div>
        </Container>
    );
}
