import React from 'react';
import { Text, ActionIcon } from '@mantine/core';
import { IconBrandGithub, IconBrandLinkedin, IconBrandTwitter } from '@tabler/icons-react';

export default function FooterEMS() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <Text 
              variant="gradient"
              gradient={{ from: 'indigo', to: 'cyan', deg: 45 }}
              className="font-bold text-3xl"
            >
              EMS
            </Text>
            <Text className="text-gray-400 text-sm max-w-md">
              Streamline your workforce management with our modern employee management solution.
              Built for teams that value simplicity and efficiency.
            </Text>
            <div className="flex space-x-4">
              <ActionIcon 
                variant="subtle" 
                size="lg"
                className="text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <IconBrandGithub size={22} />
              </ActionIcon>
              <ActionIcon 
                variant="subtle" 
                size="lg"
                className="text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <IconBrandLinkedin size={22} />
              </ActionIcon>
              <ActionIcon 
                variant="subtle" 
                size="lg"
                className="text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <IconBrandTwitter size={22} />
              </ActionIcon>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Product</h3>
              <ul className="space-y-2">
                {['Features', 'Pricing', 'Documentation', 'Updates'].map((item) => (
                  <li key={item} className='-ml-10'>
                    <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Company</h3>
              <ul className="space-y-2">
                {['About', 'Blog', 'Careers', 'Contact'].map((item) => (
                  <li key={item}  className='-ml-10'>
                    <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <Text className="text-gray-500 text-sm">
            © {currentYear} EMS. All rights reserved.
          </Text>
        </div>
      </div>
    </footer>
  );
}