import { Badge, Box, Button, Card, Drawer, Group, Select, Text, Textarea, TextInput, UnstyledButton } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import { useState } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { IconChevronDown } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { TasksServices } from "@/services/tasks/tasks";
import { emitter } from "@/events/statusEmitter";
import { DateInput } from "@mantine/dates";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
const ITEM_TYPE = "CARD";

const TASK_TYPE_COLORS: { [key: string]: string } = {
    BUG: "red.5",
    NEW_FEATURE: "indigo.3",
    OTHER: "gray.2",
};


// Drag Item Component
function DraggableCard({ task, moveTask }: { task: any; moveTask: (task: any, newStatus: string) => void }) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ITEM_TYPE,
        item: { id: task.id, status: task.status },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    const [opened, { open, close }] = useDisclosure(false);
    const [selectedValue, setSelectedValue] = useState(task.status); // Set initial value
    const [description, setDescription] = useState(task.description);
    const [estimate, setEstimate] = useState(task.estimation);
    const [start_date, setStartDate] = useState<Date | null>(new Date(task.start_date));
    const [end_date, setEndDate] = useState<Date | null>(new Date(task.end_date));


    const handleEstimateChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        let value = event.currentTarget.value;

        // Allow only numbers and restrict to max 2 digits
        if (/^\d{0,2}$/.test(value)) {
            setEstimate(value);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevents Enter key from working
        }
    };

    const updateTask = () => {
        // Update task with new status, description and estimate
        moveTask({ ...task, status: selectedValue, description: description, estimation: estimate }, selectedValue);

        

        TasksServices.updateTask(task.id, { status: selectedValue, description: description, estimation: estimate, start_date: start_date, end_date: end_date }).catch((error) => {
            console.log(error);
        });



        close();
    };

    return (
        <>
            <Drawer
                opened={opened}
                onClose={updateTask}
                title={''}
                overlayProps={{ opacity: 0.5, blur: 4 }}
                position="right" size="lg"
                className=""
            >
                <div className="px-6">
                    <Text className="text-2xl font-semibold text-indigo-900">{task.summary}</Text>
                    <Select
                        className="mt-2 w-[170px] text-white"
                        color="blue"
                        placeholder={task.status}
                        value={selectedValue}
                        onChange={setSelectedValue}
                        data={[
                            { value: 'TO DO', label: 'TO DO' },
                            { value: 'IN PROGRESS', label: 'IN PROGRESS' },
                            { value: 'DONE', label: 'DONE' },
                        ]}
                        sx={{
                            input: {
                                backgroundColor: '#228be6',
                                color: '#ffffff',
                            }
                        }}
                        icon={<IconChevronDown color="white" />}
                    />
                    <div className="flex flex-row justify-between w-80 mt-8 ml-1">
                        <Text className="text-sm font-semibold"> Remaining estimate (hours)</Text>
                        <Textarea
                            className="text-sm hover:bg-slate-100 active:bg-slate-200 -mt-[10px] w-8 absolute right-10"
                            autosize
                            minRows={1}
                            maxRows={1}
                            variant="unstyled"
                            value={estimate}
                            onChange={handleEstimateChange}
                            onKeyDown={handleKeyDown} // Blocks Enter key
                        >
                        </Textarea>
                    </div>

                    <div className="flex flex-row justify-between w-80 mt-6 ml-1">
                        <Text className="text-sm font-semibold mt-2"> Start date</Text>
                        <DateInput
                            value={start_date}
                            onChange={setStartDate}
                            // label="Start date"
                            placeholder="Date input"
                            className="text-bold absolute right-10"
                        />
                    </div>

                    <div className="flex flex-row justify-between w-80 mt-6 ml-1">
                        <Text className="text-sm font-semibold mt-2"> Expected end date</Text>
                        <DateInput
                            value={end_date}
                            onChange={setEndDate}
                            // label="Start date"
                            placeholder="Date input"
                            className="text-bold absolute right-10"
                        />
                    </div>

                    <div className="ml-1">
                        <Text className="text-sm font-semibold mt-8 "> Description</Text>
                        <Textarea
                            className="text-sm mt-2 hover:bg-slate-100 active:bg-slate-200 h-56"
                            autosize
                            minRows={2}
                            maxRows={10}
                            variant="unstyled"
                            value={description}
                            onChange={(event) => setDescription(event.currentTarget.value)}
                        >
                        </Textarea>
                    </div>
                    <div className="flex flex-row justify-between w-80 mt-6 ml-1">
                        <Text className="text-sm font-semibold mt-2"> Date created</Text>
                        <DateInput
                            value={new Date(task?.date_created)}
                            disabled
                            placeholder="Date input"
                            className="text-bold absolute right-10"
                        />
                    </div>

                    
                </div>
            </Drawer>

            <Card
                ref={drag}
                className="ml-2 bg-white text-slate-700 hover:text-slate-900 hover:bg-zinc-50 m-4 cursor-grab flex flex-col"
                style={{ opacity: isDragging ? 0.5 : 1 }}
                onClick={open}
            >
                <div className="flex flex-row justify-between">
                    <Text className="font-semibold">{task.summary}</Text>
                    <Badge radius="xs" className="w-fit -mt-0.5 -ml-0.5 p-3" color={TASK_TYPE_COLORS[task.type]}>{task.type}</Badge>
                </div>
                
                <div className="flex flex-row justify-between mt-8">
                    <Text className="text-sm font-semibold"> Remaining estimate</Text>
                    <Text className="text-sm" key={task.estimation}>{estimate}h</Text>
                </div>
                <div className="flex flex-row justify-between">
                    <Text className="text-sm font-semibold"> Original estimate</Text>
                    <Text className="text-sm" key={task.original_estimate}>{task.original_estimate}h</Text>
                </div>     
                </Card>
        </>
    );
}

// Drop Zone Component
function DropZone({ status, tasks, moveTask, memberId, setTasks, teamId }: { status: string; tasks: any[]; moveTask: (task: any, newStatus: string) => void; memberId: string; setTasks: any; teamId: string }) {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: ITEM_TYPE,
        drop: (item: any) => moveTask(item, status),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    }));

    const [openedCreateTask, { open: openCreateTask, close: closeCreateTask }] = useDisclosure(false);

    const form = useForm({
        initialValues: {
            status: 'TO DO',
            summary: '',
            type: '',
            estimation: 0,
            description: '',
            assigned_to: 0,
            start_date: "",
            end_date: "",
        },
        validate: {
            type: (value) => !value && 'Type is required',
            summary: (value) => !value && 'Summary is required',
            description: (value) => value?.length < 10 && 'Description should be at least 10 characters long',
            estimation: (value) => {
                const num = Number(value);
                if (isNaN(num)) {
                    return 'Value must be numeric';
                }
                if (num <= 0) {
                    return 'Value must be greater than 0';
                }
                return null;
            },
            start_date: (value) => !value && 'Start date is required',
            end_date: (value) => !value && 'End date is required',
        }
    });

    const handleSubmitForm = (values: any) => { 
        const task = { ...values, assigned_to: memberId, team: teamId };

        TasksServices.createTask(task).then((res) => {
            const newTask = res.data;
            setTasks((prev: any) => [...prev, newTask]);
            // Emit an event so that TaskStatusBar (or its parent) can update
            emitter.emit("taskCreated", newTask);
            closeCreateTask();
        }).catch((error) => {
            console.log(error);
        }
        );
    };

    return (
        <>
            <Drawer
                opened={openedCreateTask}
                onClose={closeCreateTask}
                title={''}
                overlayProps={{ opacity: 0.5, blur: 4 }}
                position="right" size="lg"
                className=""
            >
                <div className="px-6">
                    <Text className="text-2xl font-semibold text-indigo-900">Create a new task for NAME</Text>

                    <form onSubmit={form.onSubmit((values) => handleSubmitForm(values))}>
                        <Select withAsterisk className="mt-8" label="Type" placeholder="Select task type" {...form.getInputProps('type')} data={[
                            { value: 'BUG', label: 'Bug' },
                            { value: 'NEW FEATURE', label: 'New feature' },
                            { value: 'OTHER', label: 'Other' },
                        ]} />
                        <TextInput
                            withAsterisk
                            label="Summary"
                            placeholder="Develop a new feature"
                            className="mt-4"
                            {...form.getInputProps('summary')}
                        />

                        <TextInput
                            withAsterisk
                            label="Estimate (h)"
                            placeholder="2"
                            className="mt-4"
                            {...form.getInputProps('estimation')}
                        />

                        <DateInput
                            label="Start date"
                            placeholder="Select"
                            mx="auto"
                            className="mt-4"
                            {...form.getInputProps('start_date')}
                            withAsterisk
                        />

                        <DateInput
                            label="Expected end date"
                            placeholder="Select"
                            mx="auto"
                            className="mt-4"
                            {...form.getInputProps('end_date')}
                            withAsterisk
                        />

                        <Textarea
                            placeholder="Describe the task"
                            label="Description"
                            className="mt-4"
                            minRows={5}
                            maxRows={5}
                            {...form.getInputProps('description')}
                            withAsterisk
                        />

                        <Group position="right" mt="md">
                            <Button
                                type="submit"
                                variant="gradient"
                                gradient={{ from: 'indigo', to: 'cyan', deg: 60 }}
                                className="absolute right-10 bottom-8"
                            >Create new task</Button>
                        </Group>
                    </form>
                    
                </div>
            </Drawer>
            <Box
                ref={drop}
                className={`bg-slate-100 p-4 rounded-md w-[300px] shadow-sm transition-all ${isOver ? "bg-slate-200" : ""}`}
            >
                <div className="flex flex-row">
                    <Text className="text-slate-800">{status}</Text>
                    <Text className="font-semibold ml-2">{tasks.length}</Text>
                </div>
                {
                    status === "TO DO" && <UnstyledButton className="w-fit mt-3 ml-2 -mb-2 text-sm p-1 font-semibold text-slate-700 hover:text-slate-900"
                        onClick={openCreateTask}>+ Create task</UnstyledButton>
                }
                {tasks.map((task) => (
                    <DraggableCard key={task.id} task={task} moveTask={moveTask} />
                ))}
            </Box>
        </>
    );
}

// Main Component
export default function TasksDistributedOnStatus(props: any) {
    const [tasks, setTasks] = useState(props.tasks);
    const memberId = props.memberId;
    const teamId = props.teamId;

    const moveTask = (task: any, newStatus: string) => {
        setTasks((prev: any) =>
            prev.map((t: any) => (t.id === task.id ? { ...t, status: newStatus } : t))
        );

        const updatedTask = { ...task, status: newStatus };

        // Publish an event with the updated task
        emitter.emit("taskUpdated", updatedTask);

        // Update task status in the backend
        TasksServices.updateTask(task.id, { status: newStatus }).catch((error) => {
            console.log(error);
        });
        
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="flex flex-row space-x-4">
                <DropZone status="TO DO" tasks={tasks.filter((t: any) => t?.status === "TO DO")} moveTask={moveTask} memberId={memberId} setTasks={setTasks} teamId={teamId} />
                <DropZone status="IN PROGRESS" tasks={tasks.filter((t: any) => t?.status === "IN PROGRESS")} moveTask={moveTask} memberId={memberId?.id} setTasks={setTasks} teamId={teamId} />
                <DropZone status="DONE" tasks={tasks.filter((t: any) => t?.status === "DONE")} moveTask={moveTask} memberId={memberId?.id} setTasks={setTasks} teamId={teamId} />
            </div>
        </DndProvider>
    );
}
