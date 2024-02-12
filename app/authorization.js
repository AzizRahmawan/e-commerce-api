export const Role = {
  ADMINISTRATOR: 'administrator',
  REGULAR_USER: 'regular_user',
  SELLER: 'seller'
};

export const Permission = {
  BROWSE_TOKENS: 'browse_tokens',
  ADD_TOKEN: 'add_token',
  READ_TOKEN: 'read_token',

  BROWSE_PRODUCTS: 'browse_products',
  READ_PRODUCT: 'read_product',
  EDIT_PRODUCT: 'edit_product',
  ADD_PRODUCT: 'add_product',
  DELETE_PRODUCT: 'delete_product',

  BROWSE_SELLER: 'browse_sellers',
  READ_SELLER: 'read_seller',
  EDIT_SELLER: 'edit_seller',
  ADD_SELLER: 'add_seller',
  DELETE_SELLER: 'delete_seller',

  BROWSE_USERS: 'browse_users',
  READ_USER: 'read_user',
  EDIT_USER: 'edit_user',
  ADD_USER: 'add_user',
  DELETE_USER: 'delete_user',

  BROWSE_CATEGORIES: 'browse_categories',
  READ_CATEGORY: 'read_category',
  EDIT_CATEGORY: 'edit_category',
  ADD_CATEGORY: 'add_category',
  DELETE_CATEGORY: 'delete_category',

  BROWSE_CART: 'browse_cart',
  ADD_TO_CART: 'add_to_cart',
  REMOVE_FROM_CART: 'remove_from_cart',
  CLEAR_CART: 'clear_cart',

  BROWSE_ORDERS: 'browse_orders',
  CREATE_ORDER: 'create_order',
  CANCEL_ORDER: 'cancel_order',
  VIEW_ORDER_DETAILS: 'view_order_details',

  CHECKOUT: 'checkout'
};

export const PermissionAssignment = {
  [Role.ADMINISTRATOR]: [
    Permission.BROWSE_TOKENS,
    Permission.ADD_TOKEN,
    Permission.READ_TOKEN,

    Permission.BROWSE_PRODUCTS,
    Permission.READ_PRODUCT,
    Permission.EDIT_PRODUCT,
    Permission.ADD_PRODUCT,
    Permission.DELETE_PRODUCT,

    Permission.BROWSE_SELLER,
    Permission.READ_SELLER,
    Permission.EDIT_SELLER,
    Permission.ADD_SELLER,
    Permission.DELETE_SELLER,

    Permission.BROWSE_USERS,
    Permission.READ_USER,
    Permission.EDIT_USER,
    Permission.ADD_USER,
    Permission.DELETE_USER,

    Permission.BROWSE_CATEGORIES,
    Permission.READ_CATEGORY,
    Permission.EDIT_CATEGORY,
    Permission.ADD_CATEGORY,
    Permission.DELETE_CATEGORY,

    Permission.BROWSE_CART,
    Permission.BROWSE_ORDERS,
    Permission.CREATE_ORDER,
    Permission.CANCEL_ORDER,
    Permission.VIEW_ORDER_DETAILS,
    Permission.CHECKOUT
  ],

  [Role.REGULAR_USER]: [
    Permission.BROWSE_PRODUCTS,
    Permission.READ_PRODUCT,

    Permission.BROWSE_SELLER,
    Permission.READ_SELLER,

    Permission.BROWSE_CATEGORIES,
    Permission.READ_CATEGORY,

    Permission.BROWSE_CART,
    Permission.ADD_TO_CART,
    Permission.REMOVE_FROM_CART,
    Permission.CLEAR_CART,
    
    Permission.BROWSE_ORDERS,
    Permission.CREATE_ORDER,
    Permission.CANCEL_ORDER,
    Permission.VIEW_ORDER_DETAILS,
    Permission.CHECKOUT
  ],

  [Role.SELLER]: [
    Permission.BROWSE_PRODUCTS,
    Permission.READ_PRODUCT,
    Permission.EDIT_PRODUCT,
    Permission.ADD_PRODUCT,
    Permission.DELETE_PRODUCT,

    Permission.BROWSE_SELLER,
    Permission.READ_SELLER,
    Permission.EDIT_SELLER,
    Permission.ADD_SELLER,
    Permission.DELETE_SELLER,

    Permission.BROWSE_CATEGORIES,
    Permission.READ_CATEGORY,
    Permission.EDIT_CATEGORY,
    Permission.ADD_CATEGORY,
    Permission.DELETE_CATEGORY,

    Permission.BROWSE_ORDERS,
    Permission.VIEW_ORDER_DETAILS,
    Permission.CANCEL_ORDER
  ]
};
