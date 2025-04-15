import React from 'react';
import {Image, StyleSheet} from 'react-native';

export type IconEnum =
  | 'search'
  | 'clear'
  | 'filter'
  | 'edit'
  | 'delete'
  | 'property'
  | 'hamburgerMenu'
  | 'realEstate'
  | 'home'
  | 'client'
  | 'user'
  | 'about'
  | 'contactus'
  | 'changepassword'
  | 'faq'
  | 'logout'
  | 'ContactedProperty'
  | 'listproperty'
  | 'login'
  | 'partner'
  | 'password'
  | 'signup'
  | 'whatsapp'
  | 'phone'
  | 'threeDots'
  | 'notes'
  | 'message'
  | 'back'
  | 'eye'
  | 'crosseye'
  | 'partnership'
  | 'partner2'
  | 'partner3'
  | 'globe'
  | 'help'
  | 'calendarUpcoming'
  | 'calendarOverdue'
  | 'calendarSomeday'
  | 'calendarToday'
  | 'calendar'
  | 'chevronRight'
  | 'time'
  | 'plus'
  | 'checkmark'
  | 'greenCheck';

type IconProps = {
  iconName: IconEnum;
  color?: string;
  size?: string | number;
};

const GetIcon = ({iconName, color, size}: IconProps) => {
  const iconMap = {
    search: require('../assets/Icon/search.png'),
    clear: require('../assets/Icon/crossicon.png'),
    filter: require('../assets/Icon/filter.png'),
    edit: require('../assets/Icon/Edit.png'),
    delete: require('../assets/Icon/recycle-bin.png'),
    property: require('../assets/Icon/addproperty.png'),
    hamburgerMenu: require('../assets/Icon/hamburger.png'),
    realEstate: require('../assets/Icon/real-estate.png'),
    home: require('../assets/Icon/home.png'),
    client: require('../assets/Icon/customer.png'),
    user: require('../assets/Icon/user.png'),
    about: require('../assets/Icon/aboutus.png'),
    contactus: require('../assets/Icon/contact-mail.png'),
    changepassword: require('../assets/Icon/changepassword.png'),
    faq: require('../assets/Icon/faq.png'),
    logout: require('../assets/Icon/logout.png'),
    ContactedProperty: require('../assets/Icon/contactedproperty.png'),
    listproperty: require('../assets/Icon/listproperty.png'),
    login: require('../assets/Icon/log-in.png'),
    partner: require('../assets/Icon/partner.png'),
    password: require('../assets/Icon/password.png'),
    signup: require('../assets/Icon/signup.png'),
    whatsapp: require('../assets/Icon/whatsapp.png'),
    phone: require('../assets/Icon/phone.png'),
    threeDots: require('../assets/Icon/three-dots.png'),
    notes: require('../assets/Icon/notes.png'),
    message: require('../assets/Icon/message.png'),
    back: require('../assets/Icon/back-button.png'),
    eye: require('../assets/Icon/eye.png'),
    crosseye: require('../assets/Icon/eye-slash.png'),
    partnership: require('../assets/Icon/partnership.png'),
    partner2: require('../assets/Icon/trustworthy.png'),
    partner3: require('../assets/Icon/partner2.png'),
    globe: require('../assets/Icon/earth.png'),
    help: require('../assets/Icon/help.png'),
    calendarUpcoming: require('../assets/Icon/calendar-upcoming.png'),
    calendarOverdue: require('../assets/Icon/calendar-overdue.png'),
    calendarSomeday: require('../assets/Icon/calendar-someday.png'),
    calendarToday: require('../assets/Icon/calendar-today.png'),
    calendar: require('../assets/Icon/calendar.png'),
    chevronRight: require('../assets/Icon/chevron-right.png'),
    time: require('../assets/Icon/time.png'),
    plus: require('../assets/Icon/plus.png'),
    checkmark: require('../assets/Icon/check-mark.png'),
    greenCheck: require('../assets/Icon/check.png'),
  };

  const imageStyle = [
    styles.searchIcon,
    color ? {tintColor: color} : null,
    size ? {width: Number(size), height: Number(size)} : null,
  ];

  return <Image source={iconMap[iconName]} style={imageStyle} />;
};

const styles = StyleSheet.create({
  searchIcon: {
    height: 20,
    width: 20,
  },
});

export default GetIcon;
