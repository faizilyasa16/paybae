import './bootstrap';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';

if (document.getElementById('app')) {
  createInertiaApp({
    resolve: name => {
      const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })
      return pages[`./Pages/${name}.jsx`]
    },
    setup({ el, App, props }) {
<<<<<<< HEAD
      createRoot(el).render(<App {...props} />);
=======
      createRoot(el).render(<App {...props} />)
>>>>>>> 1f443c22033d10ff0b6b1a7903eb8bd0a8b0201d
    },
  })
}
