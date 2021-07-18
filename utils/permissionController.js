const express = require('express');

const router = express.Router();

const permissions = [
//permissions for accessing properties
  {
    title: 'آگهی های فروش',
    list: [
      {
        title: 'مشاهده',
        key: 'read-property',
      },
      {
        title: 'ثبت',
        key: 'write-property',
      },
      {
        title: 'به روز رسانی',
        key: 'update-property',
      },
      {
        title: 'حذف',
        key: 'delete-property',
      },
    ],
  },
// permissions for accessing users
{
  title: 'درخواست ها',
  list: [
    {
      title: 'مشاهده',
      key: 'read-requestProperty',
    },
    {
      title: 'ثبت',
      key: 'write-requestProperty',
    },
    {
      title: 'به روز رسانی',
      key: 'update-requestProperty',
    },
    {
      title: 'حذف',
      key: 'delete-requestProperty',
    },
  ],
},

//permissions for creating locations
{
  title: 'ایجاد مکان',
  list: [
    {
      title: 'ایجاد کشور',
      key: 'write-country',
    },
    {
      title: 'ایجاد استان',
      key: 'write-state',
    },
    {
      title: 'ایجاد شهر',
      key: 'write-city',
    },
    {
      title: 'ایجاد شعبه',
      key: 'write-workplace',
    },
    {
      title: 'ایجاد منطقه',
      key: 'write-area',
    }
  ],
},
// permission to delete
{
  title: 'حذف مکان',
  list: [
    {
      title: 'حذف کشور',
      key: 'delete-country',
    },
    {
      title: 'حذف استان',
      key: 'delete-state',
    },
    {
      title: 'حذف شهر',
      key: 'delete-city',
    },
    {
      title: 'حذف شعبه',
      key: 'delete-workplace',
    },
    {
      title: 'حذف منطقه',
      key: 'delete-area',
    }
  ],
},
//permission for accessing realtors
    {  
      title:"مشاوران",
      list:[
        {
          title: 'مشاهده',
          list: [
            {
              title: 'مشاهده در کشور',
              key: 'read-realtor-country',
            },
            {
              title: 'مشاهده در استان',
              key: 'read-realtor-state',
            },
            {
              title: 'مشاهده در شهر',
              key: 'read-realtor-city',
            },
            {
              title: 'مشاهده در منطقه',
              key: 'read-realtor-area',
            },
          ],
        },
        {
          title: 'ثبت',
          list: [
            {
              title: 'ثبت در کشور',
              key: 'write-realtor-country',
            },
            {
              title: 'ثبت در استان',
              key: 'write-realtor-state',
            },
            {
              title: 'ثبت در شهر',
              key: 'write-realtor-city',
            },
            {
              title: 'ثبت در منطقه',
              key: 'write-realtor-area',
            }
          ],
        },
        {
          title: 'به روز رسانی',
          list: [
            {
              title: 'به روز رسانی در کشور',
              key: 'update-realtor-country',
            },
            {
              title: 'به روز رسانی در استان',
              key: 'update-realtor-state',
            },
            {
              title: 'به روز رسانی در شهر',
              key: 'update-realtor-city',
            },
            {
              title: 'به روز رسانی در منطقه',
              key: 'update-realtor-area',
            }
          ],
        },
        {
          title: 'حذف',
          list: [
            {
              title: 'حذف در کشور',
              key: 'delete-realtor-country',
            },
            {
              title: 'حذف در استان',
              key: 'delete-realtor-state',
            },
            {
              title: 'حذف در شهر',
              key: 'delete-realtor-city',
            },
            {
              title: 'حذف در منطقه',
              key: 'delete-realtor-area',
            }
          ],
        },
      ]
    
  },
//permissions for accessing roles 
  {
    title: 'نقش ها و مجوزها',
    list: [
      {
        title: 'مشاهده',
        key: 'read-role',
      },
      {
        title: 'ثبت یا بروزرسانی',
        key: 'write-role',
      },
      {
        title: 'حذف',
        key: 'delete-role',
      },
    ],
  },
//permissions for accessing organization positions 
{
  title: 'پست سازمانی',
  list: [
    {
      title: 'مشاهده',
      key: 'read-organizationPosition',
    },
    {
      title: 'ثبت یا بروزرسانی',
      key: 'write-organizationPosition',
    },
    {
      title: 'حذف',
      key: 'delete-organizationPosition',
    },
  ],
},{
  title:"مشتریان",
  list:[
    {
      title:"مشاهده همه مشتریان در کشور",
      key:"read-user-country"
    },
    {
      title:"مشاهده همه مشتریان در استان",
      key:"read-user-state"
    },{
      title:"مشاهده همه مشتریان در شهر",
      key:"read-user-city"
    },{
      title:"مشاهده  همه مشتریان در منطقه",
      key:"read-user-area"
    },{
      title:"ایجاد",
      key:"write-user"
    },{
      title:"به روز رسانی",
      key:"update-user"
    },{
      title:"حذف",
      key:"delete-user"
    },
  ]
},{
  title:"رد پای کاربران",
  key:"read-audit"
},
{
  title:"مشاغل",
  list:[
    {
      title:"مشاهده",
      key:"read-job"
    },
    {
      title:"ایجاد یا به روزرسانی",
      key:"write-job"
    },
    {
      title:"حذف",
      key:"delete-job"
    },
  ]
},
{
  title:"بازخورد",
  list:[
    {
      title:"مشاهده",
      key:"read-feedback"
    },
    {
      title:"ایجاد یا به روزرسانی",
      key:"write-feedback"
    },
    {
      title:"حذف",
      key:"delete-feedback"
    },
  ]
},
{
  title:"نوع مشتری",
  list:[
    {
      title:"مشاهده",
      key:"read-customerType"
    },
    {
      title:"ایجاد یا به روزرسانی",
      key:"write-customerType"
    },
    {
      title:"حذف",
      key:"delete-customerType"
    },
  ]
},
{
  title:"مراحل خرید",
  list:[
    {
      title:"مشاهده",
      key:"read-buySteps"
    },
    {
      title:"ایجاد یا به روزرسانی",
      key:"write-buySteps"
    },
    {
      title:"حذف",
      key:"delete-buySteps"
    },
  ]
},
{
  title:"رویداد",
  list:[
    {
      title:"مشاهده",
      key:"read-event"
    },
    {
      title:"ایجاد یا به روزرسانی",
      key:"write-event"
    },
    {
      title:"حذف",
      key:"delete-event"
    },
  ]
},
{
  title:"آمار",
  list:[
    {
      title:"مشاهده آمار خود",
      key:"read-stats-own"
    },
    {
      title:"مشاهده ی آمار مشاوران زیر مجموعه",
      key:"read-stats-myrealtors"
    },
    {
      title:"مشاهده ی آمار همه",
      key:"read-stats-all"
    },
  ]
},
];


