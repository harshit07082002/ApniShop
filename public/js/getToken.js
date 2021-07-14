import axios from 'axios';
const stripe = Stripe(
  'pk_test_51JCPtpSIbz25nq7sqfMMLWNCwThcbZM0VT1Ymd0yI1j7oe1pQGdihBMhiaxBLCN6P3Hk33XA7YjboCP2YESYDWSB00qLX0DerY'
);

const getCookie = (name) => {
  var nameEQ = name + '=';
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

const authAxios = axios.create({
  baseURL: '/api/v1',
  headers: { Authorization: `Bearer ${getCookie('jwt')}` },
});

export const signup = async (
  name,
  email,
  address,
  pincode,
  password,
  confirmPassword
) => {
  const loader = document.querySelector('.loader');
  try {
    // Adding Loader

    loader.style.display = 'block';

    // Sending axios request

    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        email: email,
        name: name,
        address: address,
        pincode: pincode,
        password: password,
        confirmPassword: confirmPassword,
      },
    });

    //Removing Loader and Error displayer

    document.querySelector('.error').style.display = 'none';
    loader.style.display = 'none';

    // Checking the result

    if (res.data.status == 'success') {
      window.location.href = '/';
    }
  } catch (err) {
    document.querySelector('.error').style.display = 'block';
    document.querySelector('.error-right p').textContent =
      err.response.data.message;
    loader.style.display = 'none';
  }
};

export const signin = async (email, password) => {
  const loader = document.querySelector('.loader');
  try {
    // Adding Loader

    loader.style.display = 'block';

    // Sending axios request

    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signin',
      data: {
        email: email,
        password: password,
      },
    });

    //Removing Loader and Error displayer

    document.querySelector('.error').style.display = 'none';
    loader.style.display = 'none';

    // Checking the result

    if (res.data.status == 'success') {
      window.location.href = '/';
    }
  } catch (err) {
    loader.style.display = 'none';
    document.querySelector('.error').style.display = 'block';
    document.querySelector('.error-right p').textContent =
      err.response.data.message;
    console.log(err.response.data.message);
  }
};
export const Logout = async () => {
  try {
    // Sending axios request

    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });

    // Checking the result

    if (res.data.status == 'success') {
      window.location.href = '/';
    }
  } catch (err) {
    console.log(err.response.data.message);
  }
};

export const addReview = async (review, rating, product) => {
  const loader = document.querySelector('.loader');

  try {
    // Adding Loader

    loader.style.display = 'block';

    const res = await authAxios({
      method: 'POST',
      url: '/reviews',
      data: {
        review,
        rating,
        product,
      },
    });

    //Removing Loader and Error displayer

    document.querySelector('.error').style.display = 'none';

    loader.style.display = 'none';

    // Checking the result

    if (res.data.status == 'success') {
      window.location.href = `/item/${product}`;
    }
  } catch (err) {
    console.log(err);
    loader.style.display = 'none';
    document.querySelector('.error').style.display = 'block';
    document.querySelector('.error-right p').textContent =
      err.response.data.message;
    console.log(err.response.data.message);
  }
};

export const addToCart1 = async (itemsQTY, ID) => {
  const loader = document.querySelector('.loader');
  const count = document.querySelector('#countItem');
  try {
    // Adding Loader

    loader.style.display = 'block';

    const res = await authAxios({
      method: 'POST',
      url: '/cart',
      data: {
        product: [{ item: ID, qty: itemsQTY }],
      },
    });

    //Removing Loader and Error displayer

    document.querySelector('.error').style.display = 'none';

    loader.style.display = 'none';

    // Checking the result
    console.log(res);
    if (res.data.status == 'success') {
      let count1 = 0;
      if (res.data.cart !== undefined) {
        for (let i = 0; i < res.data.cart.product.length; i++) {
          count1 += res.data.cart.product[i].qty;
        }
      }
      console.log(`${count1}👍`);
      count.textContent = count1;
    }
  } catch (err) {
    loader.style.display = 'none';
    let error = err.response.data.message;
    if (err.response.data.message == 'jwt malformed') {
      error = 'Please Sign in to buy the item';
    }
    document.querySelector('.error').style.display = 'block';
    document.querySelector('.error-right p').textContent = error;
    console.log(err.response.data.message);
  }
};

export const deleteItem = async (ID) => {
  const loader = document.querySelector('.loader');
  const count = document.querySelector('#countItem');
  try {
    // Adding Loader

    loader.style.display = 'block';

    const res = await authAxios({
      method: 'DELETE',
      url: '/cart',
      data: {
        product: ID,
      },
    });

    //Removing Loader and Error displayer

    document.querySelector('.error').style.display = 'none';

    loader.style.display = 'none';

    // Checking the result
    console.log(res);
    if (res.data.status == 'success') {
      window.location.reload();
    }
  } catch (err) {
    loader.style.display = 'none';
    let error = err.response.data.message;
    if (err.response.data.message == 'jwt malformed') {
      error = 'Please Sign in to continue';
    }
    document.querySelector('.error').style.display = 'block';
    document.querySelector('.error-right p').textContent = error;
    console.log(err.response.data.message);
  }
};
export const updateQTY = async (qty, ID) => {
  const loader = document.querySelector('.loader');
  const count = document.querySelector('#countItem');
  try {
    // Adding Loader

    loader.style.display = 'block';

    const res = await authAxios({
      method: 'PATCH',
      url: '/cart',
      data: {
        product: ID,
        qty,
      },
    });

    //Removing Loader and Error displayer

    document.querySelector('.error').style.display = 'none';

    loader.style.display = 'none';

    // Checking the result
    console.log(res);
    if (res.data.status == 'success') {
      window.location.reload();
    }
  } catch (err) {
    loader.style.display = 'none';
    let error = err.response.data.message;
    if (err.response.data.message == 'jwt malformed') {
      error = 'Please Sign in to continue';
    }
    document.querySelector('.error').style.display = 'block';
    document.querySelector('.error-right p').textContent = error;
    console.log(err.response.data.message);
  }
};
export const checkout = async (ID) => {
  const loader = document.querySelector('.loader');
  const count = document.querySelector('#countItem');
  try {
    // Adding Loader

    loader.style.display = 'block';

    const res = await authAxios({
      method: 'GET',
      url: `order/checkout-session/${ID}`,
    });

    //Removing Loader and Error displayer

    document.querySelector('.error').style.display = 'none';

    loader.style.display = 'none';

    // Checking the result
    console.log(res);
    if (res.data.status == 'success') {
      await stripe.redirectToCheckout({
        sessionId: res.data.session.id,
      });
    }
  } catch (err) {
    loader.style.display = 'none';
    let error = err.response.data.message;
    if (err.response.data.message == 'jwt malformed') {
      error = 'Please Sign in to continue';
    }
    document.querySelector('.error').style.display = 'block';
    document.querySelector('.error-right p').textContent = error;
    console.log(err.response.data.message);
  }
};
export const changeDetails = async (name, email, address, pincode) => {
  const loader = document.querySelector('.loader');
  const count = document.querySelector('#countItem');
  try {
    // Adding Loader

    loader.style.display = 'block';

    const res = await authAxios({
      method: 'PATCH',
      url: `users/updateme`,
      data: {
        name,
        email,
        address,
        pincode,
      },
    });

    //Removing Loader and Error displayer

    document.querySelector('.error').style.display = 'none';
    document.querySelector('.error-2').style.display = 'none';

    loader.style.display = 'none';

    // Checking the result
    console.log(res);
    if (res.data.status == 'success') {
      document.querySelector('.error-2').style.display = 'block';
    }
  } catch (err) {
    loader.style.display = 'none';
    let error = err.response.data.message;
    if (err.response.data.message == 'jwt malformed') {
      error = 'Please Sign in to continue';
    }
    document.querySelector('.error').style.display = 'block';
    document.querySelector('.error-right p').textContent = error;
    console.log(err.response.data.message);
  }
};
export const updateStatus = async (id) => {
  const loader = document.querySelector('.loader');
  const count = document.querySelector('#countItem');
  try {
    // Adding Loader

    loader.style.display = 'block';

    const res = await authAxios({
      method: 'PATCH',
      url: `order/${id}`,
      data: {
        status: 'Success',
      },
    });

    //Removing Loader and Error displayer

    document.querySelector('.error').style.display = 'none';

    loader.style.display = 'none';

    // Checking the result
    console.log(res);
    if (res.data.status == 'success') {
      window.location.reload();
    }
  } catch (err) {
    loader.style.display = 'none';
    let error = err.response.data.message;
    if (err.response.data.message == 'jwt malformed') {
      error = 'Please Sign in to continue';
    }
    document.querySelector('.error').style.display = 'block';
    document.querySelector('.error-right p').textContent = error;
    console.log(err.response.data.message);
  }
};
export const changePasswordDetails = async (
  currentPassword,
  password,
  confirmPassword
) => {
  const loader = document.querySelector('.loader');
  const count = document.querySelector('#countItem');
  try {
    // Adding Loader

    loader.style.display = 'block';

    const res = await authAxios({
      method: 'POST',
      url: `users/changePassword`,
      data: {
        currentPassword,
        password,
        confirmPassword,
      },
    });

    //Removing Loader and Error displayer

    document.querySelector('.error').style.display = 'none';
    document.querySelector('.error-2').style.display = 'none';

    loader.style.display = 'none';

    // Checking the result
    console.log(res);
    if (res.data.status == 'success') {
      document.querySelector('.error-2').style.display = 'block';
      document.querySelector('#current-password').value = '';
      document.querySelector('#password').value = '';
      document.querySelector('#confirm-password').value = '';
    }
  } catch (err) {
    loader.style.display = 'none';
    let error = err.response.data.message;
    if (err.response.data.message == 'jwt malformed') {
      error = 'Please Sign in to continue';
    }
    document.querySelector('.error').style.display = 'block';
    document.querySelector('.error-right p').textContent = error;
    console.log(err.response.data.message);
  }
};
