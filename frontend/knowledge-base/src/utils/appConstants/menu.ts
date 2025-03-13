import { MdLogout, MdAirplaneTicket } from 'react-icons/md';
import { FiGlobe } from 'react-icons/fi';
import { HiLocationMarker, HiBookOpen } from 'react-icons/hi';
import { FaMapMarkerAlt } from 'react-icons/fa';

export const dashboardMenu = [
  {
    name: 'Knowledgebase',
    href: '/knowledgebase',
    Icon: HiBookOpen,
  },
  {
    name: 'Languages',
    href: '/languages',
    Icon: FiGlobe,
  },
  {
    name: 'Provinces',
    href: '/provinces',
    Icon: FaMapMarkerAlt,
  },
  {
    name: 'Districts',
    href: '/districts',
    Icon: HiLocationMarker,
  },
  {
    name: 'Tickets',
    href: '/tickets',
    Icon: MdAirplaneTicket,
  },
  {
    name: 'Logout',
    Icon: MdLogout,
    href: '/logout',
  },
];
