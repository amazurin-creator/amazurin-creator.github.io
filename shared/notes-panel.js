// Designer Notes — shared init.
// Pages embed: <template id="designer-notes">…</template>
// then call initNotesPanel(). The template content is cloned into the panel.

export function initNotesPanel() {
  const template = document.getElementById('designer-notes');
  if (!template) return;

  const trigger = document.createElement('button');
  trigger.className = 'notes-trigger';
  trigger.setAttribute('aria-label', 'Open designer notes');
  trigger.textContent = 'i';

  const backdrop = document.createElement('div');
  backdrop.className = 'notes-backdrop';

  const panel = document.createElement('aside');
  panel.className = 'notes-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Designer notes');

  const close = document.createElement('button');
  close.className = 'notes-close';
  close.setAttribute('aria-label', 'Close designer notes');
  close.innerHTML = '&times;';
  panel.appendChild(close);

  panel.appendChild(template.content.cloneNode(true));

  document.body.append(trigger, backdrop, panel);

  function open() {
    panel.classList.add('open');
    backdrop.classList.add('open');
  }
  function shut() {
    panel.classList.remove('open');
    backdrop.classList.remove('open');
  }
  trigger.addEventListener('click', open);
  close.addEventListener('click', shut);
  backdrop.addEventListener('click', shut);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') shut(); });
}
