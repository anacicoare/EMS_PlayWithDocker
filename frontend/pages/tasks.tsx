import FooterEMS from "@/contents/components/footer/Footer";
import Header from "@/contents/components/header/Header";
import { ScrollArea } from "@mantine/core";
import TeamPage from "@/contents/components/tasks/TeamPage";

export default function Tasks() {
    return <div>
        <Header />
        <ScrollArea className="flex-1 h-[calc(100vh-52px)] overflow-auto">
            <TeamPage />
            <FooterEMS />
        </ScrollArea>

    </div>
}