// mpc.js
(function (exports, node) {
  var saved_instance;

  exports.connect = function (hostname, computation_id, options) {
    var opt = Object.assign({}, options);
    opt.crypto_provider = true;

    if (node) {
      // eslint-disable-next-line no-undef
      JIFFClient = require('../../lib/jiff-client');
    }

    // eslint-disable-next-line no-undef
    saved_instance = new JIFFClient(hostname, computation_id, opt);
    return saved_instance;
  };

  // The MPC computation for median
  exports.compute = function (input, jiff_instance) {
    if (jiff_instance == null) {
      jiff_instance = saved_instance;
    }

    // Share the input
    var shares = jiff_instance.share(input);
    var allShares = Object.values(shares);

    // Implement secure sorting
    var sortedShares = secureSort(allShares, jiff_instance);

    // Compute the median
    var median = computeMedian(sortedShares, jiff_instance);

    // Return a promise to the final output
    return jiff_instance.open(median);
  };

  // Secure sorting function (simplified version for demonstration)
  function secureSort(sharesArray, jiff_instance) {
    // Using bubble sort for demonstration purposes
    console.log('sharesArray:', sharesArray);
    // console.log('Jiff Instance:', jiff_instance);
    let n = sharesArray.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        // Asynchronously compare two adjacent shares
        jiff_instance.SecretShare.prototype.sgt(sharesArray[j], sharesArray[j + 1]).then(function (isGreater) {
          if (isGreater) {
            // Swap the shares if necessary
            let temp = sharesArray[j];
            sharesArray[j] = sharesArray[j + 1];
            sharesArray[j + 1] = temp;
          }
        });
      }
    }

    // Return the sorted array of shares
    return sharesArray;
  }


  // Compute the median from sorted shares
  function computeMedian(sortedShares, jiff_instance) {
    var length = sortedShares.length;
    console.log('sortedShares:', sortedShares);
    console.log('length:', length);
    if (length % 2 === 1) {
      return sortedShares[Math.floor(length / 2)];
    } else {
      var mid1 = sortedShares[length / 2 - 1];
      var mid2 = sortedShares[length / 2];
      if (mid1 && mid2) {
        return mid1.sadd(mid2).sdiv(jiff_instance.share(2)[1]);
      } else {
        throw new Error('Mid1 or Mid2 is undefined');
      }
    }
  }
})(
  typeof exports === 'undefined' ? (this.mpc = {}) : exports,
  typeof exports !== 'undefined'
);
