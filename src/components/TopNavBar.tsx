import Link from 'next/link';

export const pageLinks = [
  { href: '/', label: 'Home' },
  { href: '/explore', label: 'Explore' },
  { href: '/create', label: 'Create DAO' },
  { href: '/manage', label: 'Manage DAO' },
];

const TopNavBar = () => {
  return (
    <>
      <ul className='flex flex-wrap text-xl'>
        {pageLinks.map((link) => {
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
