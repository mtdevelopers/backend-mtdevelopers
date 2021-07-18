const express = require('express');

const router = express.Router();

const permissions = [
  {
    title: 'آگهی های فروش',
    list: [
      {
        title: 'مشاهده',
        key: 'read-property',
      },
      {
        title: 'ثبت یا بروزرسانی',
        key: 'write-property',
      },
      {
        title: 'حذف',
        key: 'delete-property',
      },
    ],
  },
  {
    title: 'آگهی های درخواست خرید',
    list: [
      {
        title: 'مشاهده',
        key: 'read-requestProperty',
      },
      {
        title: 'ثبت یا بروزرسانی',
        key: 'write-requestProperty',
      },
      {
        title: 'حذف',
        key: 'delete-requestProperty',
      },
    ],
  },{
    title: 'مشتریان',
    list: [
      {
        title: 'مشاهده',
        key: 'read-user',
      },
      {
        title: 'ثبت یا بروزرسانی',
        key: 'write-user',
      },
      {
        title: 'حذف',
        key: 'delete-user',
      },
    ],
  },
  {
    title: 'مشاوران',
    list: [
      {
        title: 'مشاهده',
        key: 'read-realtor',
      },
      {
        title: 'ثبت یا بروزرسانی',
        key: 'write-realtor',
      },
      {
        title: 'حذف',
        key: 'delete-realtor',
      },
    ],
  },
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
  {
    title: 'شعبات',
    list: [
      {
        title: 'مشاهده',
        key: 'read-workplace',
      },
      {
        title: 'ثبت یا بروزرسانی',
        key: 'write-workplace',
      },
      {
        title: 'حذف',
        key: 'delete-workplace',
      },
    ],
  },{
    title: 'مراحل خرید مشتریان',
    list: [
      {
        title: 'مشاهده',
        key: 'read-buySteps',
      },
      {
        title: 'ثبت یا بروزرسانی',
        key: 'write-buySteps',
      },
      {
        title: 'حذف',
        key: 'delete-buySteps',
      },
    ],
  }
  ,{
    title: 'استان',
    list: [
      {
        title: 'مشاهده',
        key: 'read-state',
      },
      {
        title: 'ثبت یا بروزرسانی',
        key: 'write-state',
      },
      {
        title: 'حذف',
        key: 'delete-state',
      },
    ],
  },{
    title: 'شهر',
    list: [
      {
        title: 'مشاهده',
        key: 'read-city',
      },
      {
        title: 'ثبت یا بروزرسانی',
        key: 'write-city',
      },
      {
        title: 'حذف',
        key: 'delete-city',
      },
    ],
  },
  ,
  {
    title: 'منطقه',
    list: [
      {
        title: 'مشاهده',
        key: 'read-area',
      },
      {
        title: 'ثبت یا بروزرسانی',
        key: 'write-area',
      },
      {
        title: 'حذف',
        key: 'delete-area',
      },
    ],
  } ,{
    title: 'مسیر',
    list: [
      {
        title: 'مشاهده',
        key: 'read-line',
      },
      {
        title: 'ثبت یا بروزرسانی',
        key: 'write-line',
      },
      {
        title: 'حذف',
        key: 'delete-line',
      },
    ],
  }
  ,{
    title: 'نوع مشتری',
    list: [
      {
        title: 'مشاهده',
        key: 'read-customerTypes',
      },
      {
        title: 'ثبت یا بروزرسانی',
        key: 'write-customerTypes',
      },
      {
        title: 'حذف',
        key: 'delete-customerTypes',
      },
    ],
  }
 
];


