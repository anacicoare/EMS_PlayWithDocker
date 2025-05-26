import React, { useRef } from 'react';
import { Button, Container, UnstyledButton, Text } from '@mantine/core';
import Header from "@/contents/components/header/Header";
import {
  IconChevronDown,
  IconApps,
  IconWallet,
  IconBeach,
  IconArrowRight,
} from "@tabler/icons-react";
import { useRouter } from "next/router";
import FooterEMS from '@/contents/components/footer/Footer';
import { motion, useInView } from 'framer-motion';

const IndexPage = () => {
  const scrollToNextSection = (id: string) => {
    const nextSection = document.getElementById(id);
    if (nextSection) {
      nextSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const router = useRouter();

  const features = [
    {
      Icon: IconApps,
      title: "Global Access",
      description: "Create and manage your account from anywhere in the world",
    },
    {
      Icon: IconApps,
      title: "Modern Tools",
      description: "Access cutting-edge tools and technologies",
    },
    {
      Icon: IconWallet,
      title: "Team Synergy",
      description: "Enhance collaboration and boost productivity",
    },
    {
      Icon: IconBeach,
      title: "Remote Freedom",
      description: "Work flexibly from any location globally",
    },
  ];

    // Animation variants
    const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
        staggerChildren: 0.8
        }
    }
    };

    const item = {
    hidden: { opacity: 0, y: 2 },
    show: { 
        opacity: 1, 
        y: 0,
        transition: {
        duration: 0.9
        }
    }
    };

    const resourcesContainer = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
            staggerChildren: 0.8
            }
        }
        };

        const resourceItem = {
        hidden: { opacity: 0, y: 2 },
        show: { 
            opacity: 1, 
            y: 0,
            transition: {
            duration: 0.9
            }
        }
        };


    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });
    const resourcesRef = useRef(null);
    const isResourcesInView = useInView(resourcesRef, { once: true, amount: 0.3 });



  return (
    <div>
      {/* First section */}
      <div
        className="bg-cover bg-center h-screen flex"
        style={{ backgroundImage: 'url("city.jpg")' }}
      >
        <div className="w-full">
          <Header />
          <div className="ml-20 mt-28">
            <h1 className="text-7xl text-white">
              CHANGE <br />
              THE WAY YOU WORK
            </h1>
            <p className="text-xl text-white -mt-3">
              For those of you who wish to make the best of your time -
              <br />
              we have EMS.
              <br />
              <br />
              <Button
                variant="filled"
                color="gray.1"
                radius="xl"
                size="sm"
                className="mr-8 mt-2 text-black"
                onClick={() => {
                  router.push("/register");
                }}
              >
                Start today
              </Button>
            </p>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <UnstyledButton onClick={() => scrollToNextSection("next-section")}>
            <IconChevronDown className="text-white font-bold" size={50} />
          </UnstyledButton>
        </div>
      </div>

      {/* Second section (full height). */}
      <div id="next-section" className="h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
        <Container size="xl" className="flex-1 flex flex-col py-20">
          <div className="text-center mb-10">
            <h2
              style={{
                fontSize: "2.25rem",
                fontWeight: 700,
                background: "linear-gradient(to right, #2563eb, #60a5fa)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Transform Your Work Experience
            </h2>
            <Text className="text-gray-600 mt-4 text-lg">
              Discover how EMS can revolutionize your workflow
            </Text>
          </div>

          <div className="flex-grow">
            <motion.div 
                ref={ref}
                variants={container}
                initial="hidden"
                animate={isInView ? "show" : "hidden"}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8"
            >
                {features.map((feature, index) => (
                <motion.div
                    key={index}
                    variants={item}
                    className="p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 items-center justify-center flex flex-col"
                >
                    <div
                    className="h-12 w-12 rounded-full flex items-center justify-center mb-4"
                    style={{
                        background: "linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)",
                    }}
                    >
                    <feature.Icon size={24} className="text-white" />
                    </div>
                    <h3
                    className="text-xl font-semibold mb-2"
                    style={{
                        background: "linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                    }}
                    >
                    {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                </motion.div>
                ))}
            </motion.div>
            </div>
        </Container>

        {/* Chevron at the bottom-middle */}
        <div className="flex justify-center items-center pb-8">
          <UnstyledButton
            onClick={() => scrollToNextSection("resources-section")}
            className="hover:scale-110 transition-transform"
          >
            <IconChevronDown
              className="text-blue-600 font-bold animate-bounce"
              size={40}
            />
          </UnstyledButton>
        </div>
      </div>

      {/* 
        Resources section
      */}
      <div
        id="resources-section"
        className="mx-auto bg-blue-700 rounded-2xl p-8 text-white w-9/12 mb-10 mt-16 scroll-mt-10"
      >
        <h3 className="text-2xl font-bold mb-8">Essential Resources</h3>
        <motion.div 
            ref={resourcesRef}
            variants={resourcesContainer}
            initial="hidden"
            animate={isResourcesInView ? "show" : "hidden"}
            className="space-y-6"
        >
          {[
            {
              title: "Modern Workforce Trends",
              description:
                "Stay ahead with the latest employee management strategies",
              url: "https://buildfire.com/modern-workforce-employee-management-trends/",
            },
            {
              title: "Creating Successful Products",
              description: "Insights on building products people truly love",
              url: "https://fi.co/insight/how-to-build-a-product-people-love-insights-from-phil-libin",
            },
            {
              title: "Effective Team Collaboration",
              description: "Solutions for common workplace communication challenges",
              url: "https://happycompanies.com/blog/solving-workplace-collaboration-problems-strategies-for-success",
            },
          ].map((resource, index) => (
            <motion.div
                key={index}
                variants={resourceItem}
                className="flex items-center justify-between group hover:bg-blue-600 p-1 rounded-xl transition-all duration-300"
                >
                <div>
                    <h4 className="text-xl font-semibold mb-1">{resource.title}</h4>
                    <p className="text-blue-100">{resource.description}</p>
                </div>
                <Button
                    variant="subtle"
                    className="text-white hover:bg-blue-800"
                    rightIcon={<IconArrowRight size={16} />}
                    onClick={() => window.open(resource.url)}
                >
                    Read More
                </Button>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <FooterEMS />
    </div>
  );
};

export default IndexPage;
