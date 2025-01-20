import { boot } from 'quasar/wrappers';

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
function moneyFmt(full = false) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: full ? 2 : 1,
    notation: full ? 'standard' : 'compact',
  });
}
export default boot(async ({ app }) => {
  app.directive('money', {
    mounted(el, binding) {
      const val = moneyFmt().format(binding.value);
      el.innerText = val;
    },
    updated(el, binding) {
      const val = moneyFmt().format(binding.value);
      el.innerText = val;
    },
  }),
    app.directive('MoneyFull', {
      mounted(el, binding) {
        const val = moneyFmt(true).format(binding.value);
        el.innerText = val;
      },
      updated(el, binding) {
        const val = moneyFmt(true).format(binding.value);
        el.innerText = val;
      },
    });
});
