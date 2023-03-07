import Link from 'next/link';

export const pageLinks = [
  { href: '/', label: 'Home' },
  { href: '/explore', label: 'Explore' },
  { href: '/create', label: 'Create DAO' },
];

// fixme styles
const TopNavBar = () => {
  return (
    <>
      <ul className='flex flex-wrap text-xl'>
        {pageLinks.map((link) => {
          return (
            <li className='mr-6' key={link.label}>
              <Link
                href={link.href}
                className='border-none hover:text-neutral-focus'>
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
