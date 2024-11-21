import { Center, rem, Stack, Tooltip, UnstyledButton } from '@mantine/core';
import { IconHome2, IconSettings } from '@tabler/icons-react';
import classes from './Navbar.module.css';
import { UserButton } from '../user/UserButton.tsx';
import { useLocation, useNavigate } from 'react-router-dom';
import { FishOne } from '../logo/FishOne.tsx';
import { useClickOutside } from '@mantine/hooks';
import { isAdmin } from '../../lib';

interface NavbarLinkProps {
  icon: typeof IconHome2;
  label: string;
  active?: boolean;

  onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton onClick={onClick} className={classes.link} data-active={active || undefined}>
        <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

interface NavbarProps {
  close?: () => void;
}

export function Navbar({ close }: NavbarProps) {
  const ref = useClickOutside(() => close && close());
  const isCurrentUserAdmin = isAdmin();

  const mainNav = [
    { icon: IconHome2, label: 'Home', route: '/' },
    { icon: IconSettings, label: 'Settings', route: '/settings', isAdmin: true },
  ];

  const navigate = useNavigate();
  const location = useLocation();
  const links = mainNav
    .filter(link => !link.isAdmin || isCurrentUserAdmin)
    .map((link) => (
      <NavbarLink
        {...link}
        key={link.label}
        active={location.pathname === link.route}
        onClick={() => {
          navigate(link.route);
          close && close();
        }}
      />
    ));

  return (
    <nav className={classes.navbar} ref={ref}>
      <Center>
        <FishOne size={30} />
      </Center>

      <div className={classes.navbarMain}>
        <Stack justify="center" gap={0}>
          {links}
        </Stack>
      </div>

      <Stack justify="center" gap={0}>
        <div className={classes.link}>
          <UserButton />
        </div>
      </Stack>
    </nav>
  );
}
