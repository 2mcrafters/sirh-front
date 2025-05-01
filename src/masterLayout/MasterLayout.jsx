/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link, NavLink, useLocation, Outlet } from "react-router-dom";
import ThemeToggleButton from "../helper/ThemeToggleButton";

const MasterLayout = () => {
  let [sidebarActive, seSidebarActive] = useState(false);
  let [mobileMenu, setMobileMenu] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleDropdownClick = (event) => {
      event.preventDefault();
      const clickedLink = event.currentTarget;
      const clickedDropdown = clickedLink.closest(".dropdown");

      if (!clickedDropdown) return;

      const isActive = clickedDropdown.classList.contains("open");

      // Close all dropdowns
      const allDropdowns = document.querySelectorAll(".sidebar-menu .dropdown");
      allDropdowns.forEach((dropdown) => {
        dropdown.classList.remove("open");
        const submenu = dropdown.querySelector(".sidebar-submenu");
        if (submenu) {
          submenu.style.maxHeight = "0px";
        }
      });

      // Toggle the clicked dropdown
      if (!isActive) {
        clickedDropdown.classList.add("open");
        const submenu = clickedDropdown.querySelector(".sidebar-submenu");
        if (submenu) {
          submenu.style.maxHeight = `${submenu.scrollHeight}px`;
        }
      }
    };

    const dropdownTriggers = document.querySelectorAll(
      ".sidebar-menu .dropdown > a, .sidebar-menu .dropdown > Link"
    );

    dropdownTriggers.forEach((trigger) => {
      trigger.addEventListener("click", handleDropdownClick);
    });

    const openActiveDropdown = () => {
      const allDropdowns = document.querySelectorAll(".sidebar-menu .dropdown");
      allDropdowns.forEach((dropdown) => {
        const submenuLinks = dropdown.querySelectorAll(".sidebar-submenu li a");
        submenuLinks.forEach((link) => {
          if (
            link.getAttribute("href") === location.pathname ||
            link.getAttribute("to") === location.pathname
          ) {
            dropdown.classList.add("open");
            const submenu = dropdown.querySelector(".sidebar-submenu");
            if (submenu) {
              submenu.style.maxHeight = `${submenu.scrollHeight}px`; // Expand submenu
            }
          }
        });
      });
    };

    // Open the submenu that contains the active route
    openActiveDropdown();

    // Cleanup event listeners on unmount
    return () => {
      dropdownTriggers.forEach((trigger) => {
        trigger.removeEventListener("click", handleDropdownClick);
      });
    };
  }, [location.pathname]);

  let sidebarControl = () => {
    seSidebarActive(!sidebarActive);
  };

  let mobileMenuControl = () => {
    setMobileMenu(!mobileMenu);
  };

  return (
    <div className="wrapper">
      <section className={mobileMenu ? "overlay active" : "overlay"}>
      {/* sidebar */}
      <aside
        className={
          sidebarActive
              ? "sidebar active"
            : mobileMenu
            ? "sidebar sidebar-open"
            : "sidebar"
        }
      >
        <button
          onClick={mobileMenuControl}
          type='button'
          className='sidebar-close-btn'
        >
          <Icon icon='radix-icons:cross-2' />
        </button>
        <div>
          <Link to='/' className='sidebar-logo'>
            <img
                src='/assets/images/logo.png'
              alt='site logo'
              className='light-logo'
            />
            <img
                src='/assets/images/logo-light.png'
              alt='site logo'
              className='dark-logo'
            />
            <img
                src='/assets/images/logo-icon.png'
              alt='site logo'
              className='logo-icon'
            />
          </Link>
        </div>
        <div className='sidebar-menu-area'>
          <ul className='sidebar-menu' id='sidebar-menu'>
              <li>
                <NavLink
                  to='/'
                  className={(navData) =>
                    navData.isActive ? "active-page" : ""
                  }
                >
                  <Icon
                    icon='solar:home-smile-angle-outline'
                    className='menu-icon'
                  />
                  <span>Dashboard</span>
                </NavLink>
              </li>
              <li className='dropdown'>
                <Link to='#'>
                  <Icon
                    icon='solar:building-outline'
                    className='menu-icon'
                  />
                  <span>Departments</span>
                </Link>
                <ul className='sidebar-submenu'>
                  <li>
                    <NavLink
                      to='/departments'
                      className={(navData) =>
                        navData.isActive ? "active-page" : ""
                      }
                    >
                      <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />
                      List Departments
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to='/departments/add'
                      className={(navData) =>
                        navData.isActive ? "active-page" : ""
                      }
                    >
                      <i className='ri-circle-fill circle-icon text-success-main w-auto' />
                      Add Department
                    </NavLink>
                  </li>
                </ul>
              </li>
              <li className='dropdown'>
                <Link to='#'>
                  <Icon
                    icon='solar:calendar-mark-outline'
                    className='menu-icon'
                  />
                  <span>Absence Requests</span>
                </Link>
                <ul className='sidebar-submenu'>
                  <li>
                    <NavLink
                      to='/absences'
                      className={(navData) =>
                        navData.isActive ? "active-page" : ""
                      }
                    >
                      <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />
                      List Requests
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to='/absences/add'
                      className={(navData) =>
                        navData.isActive ? "active-page" : ""
                      }
                    >
                      <i className='ri-circle-fill circle-icon text-success-main w-auto' />
                      Add Request
                    </NavLink>
                  </li>
                </ul>
              </li>

              {/* Pointages Dropdown */}
              <li className='dropdown'>
                <Link to='#'>
                  <Icon
                    icon='mdi:clock-outline'
                    className='menu-icon'
                  />
                  <span>Pointages</span>
                </Link>
                <ul className='sidebar-submenu'>
                  <li>
                    <NavLink
                      to='/pointages'
                      className={(navData) =>
                        navData.isActive ? "active-page" : ""
                      }
                    >
                      <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />
                      Liste des Pointages
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to='/pointages/add'
                      className={(navData) =>
                        navData.isActive ? "active-page" : ""
                      }
                    >
                      <i className='ri-circle-fill circle-icon text-success-main w-auto' />
                      Ajouter un Pointage
                    </NavLink>
                  </li>
                </ul>
              </li>

            <li className='dropdown'>
              <Link to='#'>
                <Icon
                  icon='solar:home-smile-angle-outline'
                  className='menu-icon'
                />
                <span>Dashboard</span>
              </Link>
              <ul className='sidebar-submenu'>
                <li>
                  <NavLink
                    to='/'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />
                    AI
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/index-2'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />{" "}
                    CRM
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/index-3'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-info-main w-auto' />{" "}
                    eCommerce
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/index-4'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-danger-main w-auto' />
                    Cryptocurrency
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/index-5'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-success-main w-auto' />{" "}
                    Investment
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/index-6'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-purple w-auto' />{" "}
                    LMS
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/index-7'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-info-main w-auto' />{" "}
                    NFT &amp; Gaming
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/index-8'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-info-main w-auto' />{" "}
                    Medical
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/index-9'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-info-main w-auto' />{" "}
                    Analytics
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/index-10'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-info-main w-auto' />{" "}
                    POS & Inventory
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/index-11'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-info-main w-auto' />{" "}
                    Finance & Banking
                  </NavLink>
                </li>
              </ul>
            </li>

            <li className='sidebar-menu-group-title'>Application</li>
            <li>
              <NavLink
                to='/email'
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                <Icon icon='mage:email' className='menu-icon' />
                <span>Email</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/chat-message'
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                <Icon icon='bi:chat-dots' className='menu-icon' />
                <span>Chat</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/calendar-main'
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                <Icon icon='solar:calendar-outline' className='menu-icon' />
                <span>Calendar</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/kanban'
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                <Icon
                  icon='material-symbols:map-outline'
                  className='menu-icon'
                />
                <span>Kanban</span>
              </NavLink>
            </li>

            {/* Invoice Dropdown */}
            <li className='dropdown'>
              <Link to='#'>
                <Icon icon='hugeicons:invoice-03' className='menu-icon' />
                <span>Invoice</span>
              </Link>
              <ul className='sidebar-submenu'>
                <li>
                  <NavLink
                    to='/invoice-list'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                    List
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/invoice-preview'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />
                    Preview
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/invoice-add'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-info-main w-auto' />{" "}
                    Add new
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/invoice-edit'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-danger-main w-auto' />{" "}
                    Edit
                  </NavLink>
                </li>
              </ul>
            </li>

            {/* Ai Application Dropdown */}
            <li className='dropdown'>
              <Link to='#'>
                <i className='ri-robot-2-line mr-10' />

                <span>Ai Application</span>
              </Link>
              <ul className='sidebar-submenu'>
                <li>
                  <NavLink
                    to='/text-generator'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                    Text Generator
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/code-generator'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />{" "}
                    Code Generator
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/image-generator'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-info-main w-auto' />{" "}
                    Image Generator
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/voice-generator'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-danger-main w-auto' />{" "}
                    Voice Generator
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/video-generator'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-success-main w-auto' />{" "}
                    Video Generator
                  </NavLink>
                </li>
              </ul>
            </li>

            {/* Crypto Currency Dropdown */}
            <li className='dropdown'>
              <Link to='#'>
                <i className='ri-btc-line mr-10' />
                <span>Crypto Currency</span>
              </Link>
              <ul className='sidebar-submenu'>
                <li>
                  <NavLink
                    to='/wallet'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                    Wallet
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/marketplace'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />
                    Marketplace
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/marketplace-details'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />
                    Marketplace Details
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/portfolio'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />
                    Portfolios
                  </NavLink>
                </li>
              </ul>
            </li>

            <li className='sidebar-menu-group-title'>UI Elements</li>

            {/* Components Dropdown */}
            <li className='dropdown'>
              <Link to='#'>
                <Icon
                  icon='solar:document-text-outline'
                  className='menu-icon'
                />
                <span>Components</span>
              </Link>
              <ul className='sidebar-submenu'>
                <li>
                  <NavLink
                    to='/typography'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />
                    Typography
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/colors'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />{" "}
                    Colors
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/button'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-success-main w-auto' />{" "}
                    Button
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/dropdown'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-lilac-600 w-auto' />{" "}
                    Dropdown
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/alert'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />{" "}
                    Alerts
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/card'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-danger-main w-auto' />{" "}
                    Card
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/carousel'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-info-main w-auto' />{" "}
                    Carousel
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/avatar'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-success-main w-auto' />{" "}
                    Avatars
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/progress'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                    Progress bar
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/tabs'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />{" "}
                    Tab &amp; Accordion
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/pagination'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-danger-main w-auto' />
                    Pagination
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/badges'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-info-main w-auto' />{" "}
                    Badges
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/tooltip'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-lilac-600 w-auto' />{" "}
                    Tooltip &amp; Popover
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/videos'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-cyan w-auto' />{" "}
                    Videos
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/star-rating'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-indigo w-auto' />{" "}
                    Star Ratings
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/tags'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-purple w-auto' />{" "}
                    Tags
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/list'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-red w-auto' />{" "}
                    List
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/calendar'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-yellow w-auto' />{" "}
                    Calendar
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/radio'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-orange w-auto' />{" "}
                    Radio
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/switch'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-pink w-auto' />{" "}
                    Switch
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/image-upload'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                    Upload
                  </NavLink>
                </li>
              </ul>
            </li>

            {/* Forms Dropdown */}
            <li className='dropdown'>
              <Link to='#'>
                <Icon icon='heroicons:document' className='menu-icon' />
                <span>Forms</span>
              </Link>
              <ul className='sidebar-submenu'>
                <li>
                  <NavLink
                    to='/form'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                    Input Forms
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/form-layout'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />{" "}
                    Input Layout
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/form-validation'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-success-main w-auto' />{" "}
                    Form Validation
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/wizard'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-danger-main w-auto' />{" "}
                    Form Wizard
                  </NavLink>
                </li>
              </ul>
            </li>

            {/* Table Dropdown */}
            <li className='dropdown'>
              <Link to='#'>
                <Icon icon='mingcute:storage-line' className='menu-icon' />
                <span>Table</span>
              </Link>
              <ul className='sidebar-submenu'>
                <li>
                  <NavLink
                    to='/table-basic'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                    Basic Table
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/table-data'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />{" "}
                    Data Table
                  </NavLink>
                </li>
              </ul>
            </li>

            {/* Chart Dropdown */}
            <li className='dropdown'>
              <Link to='#'>
                <Icon icon='solar:pie-chart-outline' className='menu-icon' />
                <span>Chart</span>
              </Link>
              <ul className='sidebar-submenu'>
                <li>
                  <NavLink
                    to='/line-chart'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-danger-main w-auto' />{" "}
                    Line Chart
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/column-chart'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />{" "}
                    Column Chart
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/pie-chart'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-success-main w-auto' />{" "}
                    Pie Chart
                  </NavLink>
                </li>
              </ul>
            </li>

            <li>
              <NavLink
                to='/widgets'
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                <Icon icon='fe:vector' className='menu-icon' />
                <span>Widgets</span>
              </NavLink>
            </li>

            {/* Users Dropdown */}
            <li className='dropdown'>
              <Link to='#'>
                <Icon
                  icon='flowbite:users-group-outline'
                  className='menu-icon'
                />
                <span>Users</span>
              </Link>
              <ul className='sidebar-submenu'>
                <li>
                  <NavLink
                    to='/users-list'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                    Users List
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/users-grid'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />{" "}
                    Users Grid
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/add-user'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-info-main w-auto' />{" "}
                    Add User
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/view-profile'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-danger-main w-auto' />{" "}
                    View Profile
                  </NavLink>
                </li>
              </ul>
            </li>

            {/* Role & Access Dropdown */}
            <li className='dropdown'>
              <Link to='#'>
                <i className='ri-user-settings-line' />
                <span>Role &amp; Access</span>
              </Link>
              <ul className='sidebar-submenu'>
                <li>
                  <NavLink
                    to='/role-access'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                    Role &amp; Access
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/assign-role'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />{" "}
                    Assign Role
                  </NavLink>
                </li>
              </ul>
            </li>

            <li className='sidebar-menu-group-title'>Application</li>

            {/* Authentication Dropdown */}
            <li className='dropdown'>
              <Link to='#'>
                <Icon icon='simple-line-icons:vector' className='menu-icon' />
                <span>Authentication</span>
              </Link>
              <ul className='sidebar-submenu'>
                <li>
                  <NavLink
                    to='/sign-in'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                    Sign In
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/sign-up'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />{" "}
                    Sign Up
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/forgot-password'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-info-main w-auto' />{" "}
                    Forgot Password
                  </NavLink>
                </li>
              </ul>
            </li>

            {/* gallery */}

            <li className='dropdown'>
              <Link to='#'>
                <Icon
                  icon='flowbite:users-group-outline'
                  className='menu-icon'
                />
                <span>Gallery</span>
              </Link>
              <ul className='sidebar-submenu'>
                <li>
                  <NavLink
                    to='/gallery-grid'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                    Gallery Grid
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/gallery'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />{" "}
                    Gallery Grid Desc
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/gallery-masonry'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-info-main w-auto' />{" "}
                    Gallery Grid
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/gallery-hover'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-danger-main w-auto' />{" "}
                    Gallery Hover Effect
                  </NavLink>
                </li>
              </ul>
            </li>

            <li>
              <NavLink
                to='/pricing'
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                <Icon
                  icon='hugeicons:money-send-square'
                  className='menu-icon'
                />
                <span>Pricing</span>
              </NavLink>
            </li>

            {/* Blog */}

            <li className='dropdown'>
              <Link to='#'>
                <Icon
                  icon='flowbite:users-group-outline'
                  className='menu-icon'
                />
                <span>Blog</span>
              </Link>
              <ul className='sidebar-submenu'>
                <li>
                  <NavLink
                    to='/blog'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                    Blog
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/blog-details'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />{" "}
                    Blog Details
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/add-blog'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-info-main w-auto' />{" "}
                    Add Blog
                  </NavLink>
                </li>
              </ul>
            </li>

            <li>
              <NavLink
                to='/testimonials'
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                <Icon
                  icon='mage:message-question-mark-round'
                  className='menu-icon'
                />
                <span>Testimonials</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/faq'
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                <Icon
                  icon='mage:message-question-mark-round'
                  className='menu-icon'
                />
                <span>FAQs.</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/error'
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                <Icon icon='streamline:straight-face' className='menu-icon' />
                <span>404</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/terms-condition'
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                <Icon icon='octicon:info-24' className='menu-icon' />
                <span>Terms &amp; Conditions</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/coming-soon'
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                <i className='ri-rocket-line menu-icon'></i>
                <span>Coming Soon</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/access-denied'
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                <i className='ri-folder-lock-line menu-icon'></i>
                <span>Access Denied</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/maintenance'
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                <i className='ri-hammer-line menu-icon'></i>
                <span>Maintenance</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/blank-page'
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                <i className='ri-checkbox-multiple-blank-line menu-icon'></i>
                <span>Blank Page</span>
              </NavLink>
            </li>

            {/* Settings Dropdown */}
            <li className='dropdown'>
              <Link to='#'>
                <Icon
                  icon='icon-park-outline:setting-two'
                  className='menu-icon'
                />
                <span>Settings</span>
              </Link>
              <ul className='sidebar-submenu'>
                <li>
                  <NavLink
                    to='/company'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                    Company
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/notification'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />{" "}
                    Notification
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/notification-alert'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-info-main w-auto' />{" "}
                    Notification Alert
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/theme'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-danger-main w-auto' />{" "}
                    Theme
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/currencies'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-danger-main w-auto' />{" "}
                    Currencies
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/language'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-danger-main w-auto' />{" "}
                    Languages
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/payment-gateway'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-danger-main w-auto' />{" "}
                    Payment Gateway
                  </NavLink>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </aside>

        {/* main content */}
        <main className="dashboard-main">
          <div className="dashboard-main-body">
          <Outlet />
        </div>
      </main>
    </section>
    </div>
  );
};

export default MasterLayout;
