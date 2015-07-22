module.exports = {
  access_token: function() {
    return 'secretkey';
  },
  refresh_token: function() {
    return 'anothersecretkey';
  },
  validity_access_token: function() {
    return 1;
  },
  validity_refresh_token: function() {
    return 15;
  }
}
