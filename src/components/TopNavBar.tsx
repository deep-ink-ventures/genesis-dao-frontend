import Link from 'next/link';

const links = [
  { href: '/', label: 'Home' },
  { href: '/explore', label: 'Explore' },
  { href: '/create', label: 'Create DAO' },
  { href: '/manage', label: 'Manage DAO' },
];

const TopNavBar = () => {
  return (
    <>
      <ul className='flex flex-wrap text-xl'>
        {links.map((link) => {
          return (
            <li className='mr-6' key={link.href}>
              <Link
                href={link.href}
                className='border-none hover:text-gray-900'>
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default TopNavBar;
