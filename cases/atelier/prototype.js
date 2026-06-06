/* Atelier — shared prototype interactions */

(function () {
    'use strict'

    /* -------- Language (RU / EN) -------- */
    const LANG_KEY = 'atelier-lang'
    const initialLang = localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'ru'
    document.documentElement.setAttribute('lang', initialLang)

    document.querySelectorAll('.lang-toggle button').forEach(btn => {
        btn.classList.toggle('is-on', btn.dataset.setLang === initialLang)
        btn.addEventListener('click', () => {
            const lang = btn.dataset.setLang
            document.documentElement.setAttribute('lang', lang)
            localStorage.setItem(LANG_KEY, lang)
            document.querySelectorAll('.lang-toggle button').forEach(b => {
                b.classList.toggle('is-on', b.dataset.setLang === lang)
            })
            // Re-render any dynamic price labels
            document.dispatchEvent(new CustomEvent('lang:changed', { detail: { lang } }))
        })
    })

    function currentLang() {
        return document.documentElement.getAttribute('lang') === 'en' ? 'en' : 'ru'
    }

    /* -------- Reveal on scroll -------- */
    const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('is-in')
                io.unobserve(e.target)
            }
        })
    }, { threshold: 0.18 })

    document.querySelectorAll('.reveal').forEach((el, i) => {
        el.style.setProperty('--i', i % 8)
        io.observe(el)
    })

    /* -------- Counter animation -------- */
    const counters = document.querySelectorAll('[data-count]')
    const co = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting) return
            const el = e.target
            const target = parseFloat(el.dataset.count)
            const suffix = el.dataset.suffix || ''
            const decimals = parseInt(el.dataset.decimals || '0', 10)
            const dur = 1400
            const start = performance.now()
            const initial = 0
            const tick = (now) => {
                const t = Math.min((now - start) / dur, 1)
                const eased = 1 - Math.pow(1 - t, 3)
                const v = initial + (target - initial) * eased
                el.textContent = v.toFixed(decimals) + suffix
                if (t < 1) requestAnimationFrame(tick)
            }
            requestAnimationFrame(tick)
            co.unobserve(el)
        })
    }, { threshold: 0.5 })
    counters.forEach(c => co.observe(c))

    /* -------- SVG path draw on enter -------- */
    const drawIo = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting) return
            const p = e.target
            const len = p.getTotalLength ? p.getTotalLength() : 800
            p.style.strokeDasharray = String(len)
            p.style.strokeDashoffset = String(len)
            p.style.setProperty('--draw-len', String(len))
            p.style.animation = `draw-stroke ${1.6 + Math.random() * 0.6}s ease-out forwards`
            drawIo.unobserve(p)
        })
    }, { threshold: 0.4 })
    document.querySelectorAll('[data-draw]').forEach(p => drawIo.observe(p))

    /* -------- Onboarding wizard -------- */
    const ob = document.getElementById('ob-root')
    if (ob) initOnboarding(ob)

    function initOnboarding(root) {
        const state = {
            step: 0,
            role: null,
            bottlenecks: new Set(),
            tools: new Set(),
            volume: 25,
        }

        const steps = root.querySelectorAll('[data-step]')
        const dots = root.querySelectorAll('.ob-progress .dot')
        const labelEl = root.querySelector('.ob-progress .step-label')
        const nextBtn = root.querySelector('[data-action="next"]')
        const backBtn = root.querySelector('[data-action="back"]')
        const stepLabels = {
            ru: ['Шаг 01 — кто ты', 'Шаг 02 — где затык', 'Шаг 03 — инструменты', 'Шаг 04 — объём', 'Готово — твой план'],
            en: ['Step 01 — about you', 'Step 02 — bottleneck', 'Step 03 — tools', 'Step 04 — volume', 'Done — your plan'],
        }
        const nextBtnText = { ru: ['Дальше','Дальше','Дальше','Покажи мой план'], en: ['Next','Next','Next','See my plan'] }

        function render() {
            steps.forEach((s, i) => {
                s.style.display = i === state.step ? '' : 'none'
            })
            dots.forEach((d, i) => {
                d.classList.toggle('is-active', i === state.step)
                d.classList.toggle('is-done', i < state.step)
            })
            const lang = currentLang()
            if (labelEl) labelEl.textContent = (stepLabels[lang] || stepLabels.ru)[state.step] || ''
            if (backBtn) backBtn.toggleAttribute('disabled', state.step === 0)
            if (nextBtn) {
                if (state.step === 4) {
                    nextBtn.style.display = 'none'
                } else {
                    nextBtn.style.display = ''
                    const text = (nextBtnText[lang] || nextBtnText.ru)[state.step] || (lang === 'en' ? 'Next' : 'Дальше')
                    // Update both ru/en spans inside the button
                    const ruSpan = nextBtn.querySelector('span[data-lang="ru"]')
                    const enSpan = nextBtn.querySelector('span[data-lang="en"]')
                    if (ruSpan) ruSpan.textContent = (nextBtnText.ru)[state.step] || 'Дальше'
                    if (enSpan) enSpan.textContent = (nextBtnText.en)[state.step] || 'Next'
                    // Fallback for older markup without data-lang spans
                    if (!ruSpan && !enSpan) {
                        const firstSpan = nextBtn.querySelector('span')
                        if (firstSpan) firstSpan.textContent = text
                    }
                }
                nextBtn.disabled = !canAdvance()
            }
            if (state.step === 4) renderRec()
        }

        function canAdvance() {
            if (state.step === 0) return !!state.role
            if (state.step === 1) return state.bottlenecks.size > 0
            if (state.step === 2) return true
            if (state.step === 3) return true
            return true
        }

        /* Role options */
        root.querySelectorAll('[data-role]').forEach(btn => {
            btn.addEventListener('click', () => {
                state.role = btn.dataset.role
                root.querySelectorAll('[data-role]').forEach(b => b.classList.toggle('is-selected', b === btn))
                render()
            })
        })

        /* Bottlenecks (multi) */
        root.querySelectorAll('[data-bottleneck]').forEach(chip => {
            chip.addEventListener('click', () => {
                const k = chip.dataset.bottleneck
                if (state.bottlenecks.has(k)) state.bottlenecks.delete(k)
                else state.bottlenecks.add(k)
                chip.classList.toggle('is-on')
                render()
            })
        })

        /* Tools (multi) */
        root.querySelectorAll('[data-tool]').forEach(chip => {
            chip.addEventListener('click', () => {
                const k = chip.dataset.tool
                if (state.tools.has(k)) state.tools.delete(k)
                else state.tools.add(k)
                chip.classList.toggle('is-on')
            })
        })

        /* Slider */
        const slider = root.querySelector('[data-slider]')
        const sliderOut = root.querySelector('[data-slider-out]')
        if (slider) {
            const sync = () => {
                state.volume = parseInt(slider.value, 10)
                sliderOut.textContent = state.volume + (state.volume >= 100 ? '+' : '')
                const min = parseInt(slider.min, 10)
                const max = parseInt(slider.max, 10)
                const pct = ((state.volume - min) / (max - min)) * 100
                slider.style.setProperty('--p', pct + '%')
            }
            slider.addEventListener('input', sync)
            sync()
        }

        /* Navigation */
        nextBtn?.addEventListener('click', () => {
            if (state.step < 4 && canAdvance()) {
                state.step += 1
                render()
                window.scrollTo({ top: 0, behavior: 'smooth' })
            }
        })
        backBtn?.addEventListener('click', () => {
            if (state.step > 0) {
                state.step -= 1
                render()
            }
        })

        // Re-render on language change (updates step label and Next button)
        document.addEventListener('lang:changed', render)

        /* Recommendation */
        function pickTier() {
            // Solo: own blog, low volume, no/few client accounts, low tools
            // Studio: 1-3 client blogs or solo→team, mid volume, several tools
            // Agency: 5-20 client accounts, high volume, many tools
            let score = 0
            if (state.role === 'solo') score += 0
            if (state.role === 'own') score += 1
            if (state.role === 'few') score += 3
            if (state.role === 'many') score += 5
            score += Math.min(state.bottlenecks.size, 3)
            score += Math.min(state.tools.size, 3)
            if (state.volume >= 60) score += 3
            else if (state.volume >= 25) score += 2
            else score += 0

            if (score >= 8) return 'agency'
            if (score >= 4) return 'studio'
            return 'solo'
        }

        function renderRec() {
            const tier = pickTier()
            const card = root.querySelector('[data-rec-card]')
            if (!card) return

            const labels = {
                ru: {
                    solo:   { name: 'Solo',   price: '₽2 490',  sub: '/ мес · ежемесячно', priceDisc: '₽1 743', tag: 'Indie-креатор, переходящий в команду' },
                    studio: { name: 'Studio', price: '₽7 490',  sub: '/ мес · ежемесячно', priceDisc: '₽5 243', tag: 'Малое агентство / продюсер с командой' },
                    agency: { name: 'Agency', price: '₽20 990', sub: '/ мес · ежемесячно', priceDisc: '₽14 693', tag: 'Агентства 10+ бренд-аккаунтов' },
                },
                en: {
                    solo:   { name: 'Solo',   price: '$29',  sub: '/ mo · billed monthly', priceDisc: '$20',  tag: 'Indie creator going team' },
                    studio: { name: 'Studio', price: '$89',  sub: '/ mo · billed monthly', priceDisc: '$62',  tag: 'Small agency / producer with a team' },
                    agency: { name: 'Agency', price: '$249', sub: '/ mo · billed monthly', priceDisc: '$174', tag: 'Agency, 10+ brand accounts' },
                },
            }

            const applyLabels = () => {
                const lang = currentLang()
                const l = labels[lang][tier]
                card.querySelector('[data-rec-name]').textContent = l.name
                const priceEl = card.querySelector('[data-rec-price]')
                const priceOld = card.querySelector('[data-rec-price-old]')
                if (priceEl) priceEl.textContent = l.priceDisc
                if (priceOld) priceOld.textContent = l.price
                card.querySelector('[data-rec-sub]').textContent = l.sub
                card.querySelector('[data-rec-tag]').textContent = l.tag
                // tier color/badge for comparison table
                root.querySelectorAll('[data-tier-highlight]').forEach(el => {
                    el.classList.toggle('featured-col', el.dataset.tierHighlight === tier)
                })
            }
            applyLabels()
            document.addEventListener('lang:changed', applyLabels)

            /* Why bullets — bilingual */
            const reasonsByLang = {
                ru: [], en: []
            }
            const push = (ru, en) => { reasonsByLang.ru.push(ru); reasonsByLang.en.push(en) }

            if (state.role === 'own')  push('Ты ведёшь свой блог — Discovery+Workshop сжимают research до 20 минут.', 'You run your own blog — Discovery+Workshop compress research to 20 minutes.')
            if (state.role === 'solo') push('Один креатор, рост к команде — workspace готов под invite редактора и монтажёра.', 'Solo creator scaling to a team — workspace is ready for an editor & video editor.')
            if (state.role === 'few')  push('1–3 клиентских блога — workspace на каждого, общая библиотека, разные Notion DB.', '1–3 client blogs — one workspace each, shared library, separate Notion DBs.')
            if (state.role === 'many') push('5–20 бренд-аккаунтов — нужны workspaces, audit log, billing per-tenant.', '5–20 brand accounts — you need workspaces, audit log, per-tenant billing.')

            if (state.bottlenecks.has('discovery')) push('Discovery занимает дни — LLM-поиск + Apify-verify закрывают за час.', 'Discovery takes days — LLM search + Apify verify wrap it in an hour.')
            if (state.bottlenecks.has('translate')) push('Адаптация и перевод — Whisper + динамический persona-brief встроены.', 'Translate & adapt — Whisper + dynamic persona-brief are built in.')
            if (state.bottlenecks.has('brief'))     push('ТЗ редактору — Workshop A–L собирает бриф из транскрипта в один клик.', 'Editor brief — Workshop A–L assembles it from transcript in one click.')
            if (state.bottlenecks.has('tracking'))  push('Где что опубликовано — pipeline-доска показывает все сценарии всегда.', 'What’s posted where — the pipeline board shows every script at a glance.')
            if (state.bottlenecks.has('metrics'))   push('Аналитика на пост — метрики возвращаются в Discovery scoring.', 'Post metrics feed back into Discovery scoring.')
            if (state.bottlenecks.has('research'))  push('Виралки ищу руками — Trendwatch фильтр + mention-mining делают это автоматически.', 'Hunting virals by hand — Trendwatch filter + mention-mining does it for you.')
            if (state.bottlenecks.has('approval'))  push('Согласование в DM — inline comments + версии скриптов держат ход в одном месте.', 'Approvals in DMs — inline comments + script versions keep it in one place.')

            if (state.tools.has('telegram')) push('Telegram уже встроен — handoff с ТЗ, рефом и комментарием в чат монтажёра одной кнопкой.', 'Telegram is built-in — handoff with brief, reference, and comment lands in your editor’s DM with one click.')
            else                              push('TG handoff из коробки — ТЗ улетает в чат монтажёра, статус скрипта автоматически → in production.', 'Built-in TG handoff — brief drops into the editor’s DM, script status auto-shifts to in production.')
            if (state.tools.has('linear')) push('Linear используется командой — auto-create issues на approved scripts (Studio+).', 'Your team uses Linear — auto-create issues on approved scripts (Studio+).')
            if (state.tools.has('slack'))  push('Slack — notify в канал при approved/published (Studio+).', 'Slack — notify your channel on approved/published (Studio+).')
            if (state.tools.has('notion')) push('Notion есть в стеке — ТЗ копируется в Markdown-friendly формате прямо из Workshop.', 'You still use Notion — briefs export as Markdown, paste-ready into any DB.')

            if (state.volume >= 60)      push(`Объём ${state.volume}+ сценариев в месяц — без лимитов на Discovery/Runs.`, `Volume ${state.volume}+ scripts / month — no limits on Discovery/Runs.`)
            else if (state.volume >= 25) push(`Объём ${state.volume} сценариев в месяц — комфортно укладывается в тариф.`, `${state.volume} scripts / month — comfortably fits the tier.`)
            else                         push(`Стартовый объём ${state.volume} сценариев — Free trial на 7 дней покажет границы.`, `Starter volume of ${state.volume} scripts — 7-day trial will show the limits.`)

            const ul = card.querySelector('[data-rec-list]')
            const renderReasons = () => {
                const lang = currentLang()
                const list = (reasonsByLang[lang] || reasonsByLang.ru).slice(0, 5)
                ul.innerHTML = ''
                list.forEach(r => {
                    const li = document.createElement('li')
                    li.textContent = r
                    ul.appendChild(li)
                })
            }
            renderReasons()
            document.addEventListener('lang:changed', renderReasons)
        }

        render()
    }
})()
