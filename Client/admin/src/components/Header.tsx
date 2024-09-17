import { HiOutlineBell, HiOutlineChatAlt} from "react-icons/hi"
import {Popover, Transition, Menu} from '@headlessui/react';
import classNames from "classnames";
import { Fragment } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { useUser } from "../context/userContext";
import { getCookie, removeCookie } from "typescript-cookie";


function Header() {

  const {user} = useUser();

  const navigate = useNavigate();

  const handleProfile = () => {
    navigate('/admin/profile');
  }


  const handleLogout = async () => {
    try {
        // Send logout request to the server
        await axios.post('http://127.0.0.1:8000/api/logout', {}, {
            headers: {
                Authorization: `Bearer ${getCookie('jwt')}`
            }
        });

        // Remove token from localStorage
        removeCookie('jwt');

        // Show success message
        Swal.fire({
            title: 'Logged Out',
            text: 'You have been successfully logged out.',
            icon: 'success',
            confirmButtonText: 'OK'
        });
        
        localStorage.removeItem("user");
        // Redirect user to login page
        navigate('/login');
        } catch (error) {
            // Handle error
            console.error('Logout error:', error);
            Swal.fire({
                title: 'Error',
                text: 'Something went wrong during logout.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
}
  return (
    <div className="bg-white h-16 px-4 flex justify-between items-center border-b border-gray-200">

      <div className="relative">
        <p>Welcome, {user? `${user.first_name}` : ''}</p>
      </div>

      <div className="flex gap-2 md:gap-5 lg:gap-6 items-center mr-6">
        <Popover className="relative">
          {({ open }) => (
            <>
              <Popover.Button className={classNames(open ? 'bg-gray-100' : '', 'inline-flex items-center text-gray-700 hover:text-opacity-100 focus:outline-none active:bg-gray-300 p-2 rounded-sm')}>
                <HiOutlineBell className="size-6 md:size-8"/>
              </Popover.Button>

              <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-screen max-w-sm -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-3xl">
                <div className="bg-white rounded-sm shadow-md ring-1 ring-black ring-opacity-5 px-2 py-2">
                  <strong className="text-gray-700 font-medium">Notifications</strong>
                  <div className="mt-2 py-1 text-sm">
                    No Notifications
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
        </Popover>

        <Popover className="relative">
          {({ open }) => (
            <>
              <Popover.Button className={classNames(open ? 'bg-gray-100' : '', 'inline-flex items-center text-gray-700 hover:text-opacity-100 focus:outline-none active:bg-gray-300 p-2 rounded-sm')}>
                <HiOutlineChatAlt className="size-6 md:size-8" />
              </Popover.Button>

              <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-screen max-w-sm -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-3xl">
                <div className="bg-white rounded-sm shadow-md ring-1 ring-black ring-opacity-5 px-2 py-2">
                  <strong className="text-gray-700 font-medium">Messages</strong>
                  <div className="mt-2 py-1 text-sm">
                    No new message
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
        </Popover>


        <Menu as="div" className="relative">
          <div>
            <Menu.Button className='ml-2 inline-flex items-center rounded-full focus:outline-none focus:ring-neutral-400'>
              <div className="h-10 w-10 rounded-full bg-sky-500 bg-cover bg-no-repeat bg-center" style={{backgroundImage:'url(https://img.freepik.com/free-photo/smiling-young-male-professional-standing-with-arms-crossed-while-making-eye-contact-against-isolated-background_662251-838.jpg?t=st=1713291356~exp=1713294956~hmac=3b615bc1a2ada227ff7f382fc0e5f584fd4ffb038ae5a2cd640aea64056b992e&w=740)'}}>
                
              </div>
            </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className='origin-top-right z-10 absolute right-0 mt-8 w-48 rounded-sm shadow-md p-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none'>
            <div className="px-4 py-3">
              <span className="block text-sm text-gray-900 dark:text-white">{user? `${user.first_name}` : ''}</span>
              <span className="block text-sm text-gray-500 truncate dark:text-gray-400">Admin</span>
            </div>

              <Menu.Item>
                {({ active }) => (
                  <div onClick={handleProfile} className={classNames(active ? 'bg-gray-100' : '', 'text-gray-700 focus:bg-gray-200 block cursor-pointer rounded-sm px-3 py-1')}>
                    Your Profile
                  </div>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <div onClick={handleLogout} className={classNames(active ? 'bg-gray-100' : '', 'text-gray-700 focus:bg-gray-200 block cursor-pointer rounded-sm px-3 py-1')}>
                    Logout
                  </div>
                )}
              </Menu.Item>

          </Menu.Items>

        </Transition>

      </Menu>

      </div>
    </div>
  )
}

export default Header