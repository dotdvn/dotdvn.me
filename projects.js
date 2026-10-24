(() => {
    const supabaseUrl = 'https://ndapsrixpdxvvqkefayy.supabase.co';
    const publishableKey = 'sb_publishable_4khxzwaFQ9ALRXbNJsoDHQ_8j_378sB';
    const projectGrid = document.querySelector('#projects-grid');
    if (!projectGrid) return;

    const headers = {
        apikey: publishableKey,
        Authorization: `Bearer ${publishableKey}`
    };

    const createText = (tag, text, className) => {
        const element = document.createElement(tag);
        element.textContent = text || '';
        if (className) element.className = className;
        return element;
    };

    const validUrl = (value) => {
        try {
            const url = new URL(value);
            return ['https:', 'http:'].includes(url.protocol) ? url.href : '';
        } catch {
            return '';
        }
    };

    async function signedImageUrl(path) {
        if (!path) return '';
        const response = await fetch(`${supabaseUrl}/storage/v1/object/sign/work-images/${path.split('/').map(encodeURIComponent).join('/')}`, {
            method: 'POST',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({ expiresIn: 3600 })
        });
        if (!response.ok) return '';
        const data = await response.json();
        return data.signedURL ? `${supabaseUrl}/storage/v1${data.signedURL}` : '';
    }

    async function projectCard(project) {
        const card = document.createElement('article');
        card.className = 'project-card animate-reveal';
        const images = [...(project.work_images || [])].sort((a, b) => a.sort_order - b.sort_order);
        const imageUrl = await signedImageUrl(images[0]?.path);

        const visual = document.createElement('div');
        visual.className = 'project-card-image';
        if (imageUrl) {
            const image = document.createElement('img');
            image.src = imageUrl;
            image.alt = images[0].alt || `${project.title} project cover`;
            image.loading = 'lazy';
            visual.append(image);
        } else {
            visual.append(createText('span', `DOTDVN / ${project.category || 'PROJECT'}`, 'project-image-fallback'));
        }

        const content = document.createElement('div');
        content.className = 'project-card-content';
        content.append(createText('p', project.category || 'PROJECT', 'technical-label'));
        content.append(createText('h2', project.title || 'Untitled project'));
        content.append(createText('p', project.summary || project.description || 'A DOT DVN project.'));
        const tags = document.createElement('div');
        tags.className = 'project-tags';
        (project.technologies || []).filter(Boolean).slice(0, 4).forEach(tag => tags.append(createText('span', tag)));
        content.append(tags);
        const destination = validUrl(project.live_url) || validUrl(project.github_url);
        if (destination) {
            const link = document.createElement('a');
            link.className = 'project-open-link';
            link.href = destination;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.textContent = 'OPEN PROJECT ↗';
            content.append(link);
        }
        card.append(visual, content);
        return card;
    }

    async function loadProjects() {
        try {
            const response = await fetch(`${supabaseUrl}/rest/v1/works?select=id,title,summary,description,category,technologies,live_url,github_url,sort_order,created_at,work_images(id,path,alt,sort_order)&status=eq.published&deleted_at=is.null&order=sort_order.asc,created_at.desc`, { headers });
            if (!response.ok) throw new Error('Unable to load projects');
            const projects = await response.json();
            if (!Array.isArray(projects) || !projects.length) return;
            const cards = await Promise.all(projects.map(projectCard));
            projectGrid.replaceChildren(...cards);
        } catch {
        }
    }

    loadProjects();
})();
