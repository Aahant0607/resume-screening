function addField(containerId) {
    const container = document.getElementById(containerId);
    const newField = document.createElement('textarea');
    newField.name = containerId + '-item';
    newField.classList.add('multi-input');
    container.appendChild(newField);
}

function addEducation() {
    const container = document.getElementById('education-list');
    const div = document.createElement('div');
    div.classList.add('education-item', 'input-row');
    div.innerHTML = `
        <input type="text" name="education-institute" placeholder="Institute Name" required />
        <input type="text" name="education-degree" placeholder="Degree / Description" required />
        <input type="text" name="education-from" placeholder="From (e.g. 2018)" required />
        <input type="text" name="education-to" placeholder="To (e.g. 2022)" required />
    `;
    container.appendChild(div);
}

function addWork() {
    const container = document.getElementById('work-experience-list');
    const div = document.createElement('div');
    div.classList.add('work-item', 'input-row');
    div.innerHTML = `
        <input type="text" name="work-org" placeholder="Organization Name" required />
        <input type="text" name="work-role" placeholder="Role / Description" required />
        <input type="month" name="work-from" placeholder="From" required />
        <input type="month" name="work-to" placeholder="To" />
        <label class="present-checkbox-label">
            <input type="checkbox" name="work-present" /> Present
        </label>
    `;
    container.appendChild(div);
}

function addProject() {
    const container = document.getElementById('projects-list');
    const div = document.createElement('div');
    div.classList.add('project-item', 'input-row');
    div.innerHTML = `
        <input type="text" name="project-title" placeholder="Project Title" required />
        <input type="text" name="project-description" placeholder="Description" required />
        <input type="text" name="project-duration" placeholder="Duration (e.g. Jan 2023 - May 2023)" required />
        <input type="url" name="project-link" placeholder="Live Link (https://...)" />
    `;
    container.appendChild(div);
}

function addSkill() {
    const container = document.getElementById('skills-list');
    const input = document.createElement('input');
    input.type = 'text';
    input.name = 'skills-item';
    input.classList.add('skill-input');
    input.placeholder = 'Skill';
    container.appendChild(input);
}

function generatePDF() {
    const { jsPDF } = window.jspdf;
    let doc = new jsPDF();

    let y = 20;
    const marginLeft = 14;
    const marginRight = 14;
    const pageHeight = doc.internal.pageSize.height;
    const printableHeight = pageHeight - 20; // bottom margin

    let name = document.getElementById("name").value.trim() || "Your Name";
    let email = document.getElementById("email").value.trim() || "your.email@example.com";
    let phone = document.getElementById("phone").value.trim() || "123-456-7890";
    let linkedin = document.getElementById("linkedin").value.trim() || "";
    let portfolio = document.getElementById("portfolio").value.trim() || "";

    // Helper for page breaks
    function ensureSpace(linesNeeded, lineHeight = 6, extra = 0) {
        if (y + linesNeeded * lineHeight + extra > printableHeight) {
            doc.addPage();
            y = 20;
        }
    }

    // Handle Image Upload
    let imgInput = document.getElementById("photo").files[0];
    if (imgInput) {
        let reader = new FileReader();
        reader.onload = function (event) {
            doc.addImage(event.target.result, 'JPEG', 160, 10, 30, 30);
            writeHeader();
        };
        reader.readAsDataURL(imgInput);
    } else {
        writeHeader();
    }

    function writeHeader() {
        doc.setFontSize(24);
        doc.setTextColor(0, 114, 255);
        doc.text(name, marginLeft, y);
        y += 10;

        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        doc.text(`Email: ${email}`, marginLeft, y);
        y += 6;
        doc.text(`Phone: ${phone}`, marginLeft, y);
        y += 6;
        if (linkedin) {
            doc.text(`LinkedIn: ${linkedin}`, marginLeft, y);
            y += 6;
        }
        if (portfolio) {
            doc.text(`Portfolio: ${portfolio}`, marginLeft, y);
            y += 6;
        }

        addSection('Career Objective', document.getElementById('career-objective').value);

        addEducationSection();
        addWorkSection();
        addMultiSection('Extra-Curricular Activities', 'extracurricular-list');
        addSingleFieldSection('Trainings / Courses', 'trainings');
        addProjectSection();
        addSkillsSection();
        addMultiSection('Accomplishments / Additional Details', 'accomplishments-list');

        const fileName = document.getElementById('name').value.trim() || 'resume';
        doc.save(`${fileName.replace(/ /g, '_')}.pdf`);
    }

    function addSection(title, content) {
        if (!content.trim()) return;
        ensureSpace(3);
        y += 10;
        doc.setFontSize(16);
        doc.setTextColor(0, 114, 255);
        doc.text(title, marginLeft, y);
        y += 7;
        doc.setFontSize(12);
        doc.setTextColor(30, 30, 30);
        let splitContent = doc.splitTextToSize(content, 180);
        ensureSpace(splitContent.length);
        doc.text(splitContent, marginLeft, y);
        y += splitContent.length * 6;
    }

    function addEducationSection() {
        const edus = document.querySelectorAll('#education-list .education-item');
        if (!edus.length) return;
        ensureSpace(3);
        y += 10;
        doc.setFontSize(16);
        doc.setTextColor(0, 114, 255);
        doc.text('Education', marginLeft, y);
        y += 8;
        doc.setFontSize(12);
        doc.setTextColor(30, 30, 30);

        edus.forEach((edu) => {
            let institute = edu.querySelector('input[name="education-institute"]').value.trim();
            let degree = edu.querySelector('input[name="education-degree"]').value.trim();
            let from = edu.querySelector('input[name="education-from"]').value.trim();
            let to = edu.querySelector('input[name="education-to"]').value.trim();

            let line = `${institute} | ${degree} | ${from} - ${to}`;
            let split = doc.splitTextToSize(line, 180);
            ensureSpace(split.length);
            doc.text(split, marginLeft, y);
            y += split.length * 6;
        });
    }

    function addWorkSection() {
        const works = document.querySelectorAll('#work-experience-list .work-item');
        if (!works.length) return;

        ensureSpace(3);
        y += 10;
        doc.setFontSize(16);
        doc.setTextColor(0, 114, 255);
        doc.text('Work Experience', marginLeft, y);
        y += 8;
        doc.setFontSize(12);
        doc.setTextColor(30, 30, 30);

        const colWidth = 90;
        let x = marginLeft;
        let count = 0;
        let maxYInRow = y;

        works.forEach((work, idx) => {
            let org = work.querySelector('input[name="work-org"]').value.trim();
            let role = work.querySelector('input[name="work-role"]').value.trim();
            let from = work.querySelector('input[name="work-from"]').value;
            let toInput = work.querySelector('input[name="work-to"]');
            let to = toInput ? toInput.value : '';
            let presentCheckbox = work.querySelector('input[name="work-present"]');
            let present = presentCheckbox && presentCheckbox.checked;

            let fromText = from ? formatMonthYear(from) : '';
            let toText = present ? 'Present' : (to ? formatMonthYear(to) : '');
            let duration = fromText + (toText ? ` - ${toText}` : '');

            let content = `${org}\n${role}\n${duration}`;
            let lines = doc.splitTextToSize(content, colWidth - 10);

            ensureSpace(lines.length, 6, 10);

            doc.text(lines, x, y);
            if (count === 0) {
                x += colWidth;
                count++;
                maxYInRow = Math.max(maxYInRow, y + lines.length * 6);
            } else {
                x = marginLeft;
                y = maxYInRow + 10;
                count = 0;
            }
        });
        if (count === 1) y = maxYInRow + 10;
    }

    function addMultiSection(title, containerId) {
        const items = document.querySelectorAll(`#${containerId} textarea`);
        const filtered = Array.from(items).map(i => i.value.trim()).filter(v => v.length);
        if (!filtered.length) return;
        ensureSpace(3);
        y += 10;
        doc.setFontSize(16);
        doc.setTextColor(0, 114, 255);
        doc.text(title, marginLeft, y);
        y += 8;
        doc.setFontSize(12);
        doc.setTextColor(30, 30, 30);
        filtered.forEach(item => {
            let split = doc.splitTextToSize("- " + item, 180);
            ensureSpace(split.length);
            doc.text(split, marginLeft, y);
            y += split.length * 6;
        });
    }

    function addSingleFieldSection(title, fieldId) {
        let content = document.getElementById(fieldId).value.trim();
        if (!content) return;
        ensureSpace(3);
        y += 10;
        doc.setFontSize(16);
        doc.setTextColor(0, 114, 255);
        doc.text(title, marginLeft, y);
        y += 8;
        doc.setFontSize(12);
        doc.setTextColor(30, 30, 30);
        let split = doc.splitTextToSize(content, 180);
        ensureSpace(split.length);
        doc.text(split, marginLeft, y);
        y += split.length * 6;
    }

    function addProjectSection() {
        const projects = document.querySelectorAll('#projects-list .project-item');
        if (!projects.length) return;
        if (y < 40) {
            y = 40;
        } else {
            y += 8; // Or adjust this value for your preferred spacing
        }
        ensureSpace(10);
        doc.setFontSize(16);
        doc.setTextColor(0, 114, 255);
        doc.text('Projects', 14, y);
        y += 10;

        const colWidth = 88;
        const boxHeight = 42;
        const horizontalGap = 10;
        let x = 14;
        let projectsInRow = 0;

        projects.forEach((proj, idx) => {
            // Start new row if needed
            if (projectsInRow === 0) {
                if (y + boxHeight > doc.internal.pageSize.height - 20) {
                    doc.addPage();
                    y = 20;
                    x = 14;
                }
            }

            // Get project data
            const title = proj.querySelector('[name="project-title"]').value;
            const desc = proj.querySelector('[name="project-description"]').value;
            const duration = proj.querySelector('[name="project-duration"]').value;
            const link = proj.querySelector('[name="project-link"]').value;

            // Draw project box
            doc.setDrawColor(200);
            doc.rect(x, y, colWidth, boxHeight);

            // Title (bold)
            doc.setFont(undefined, 'bold');
            doc.setFontSize(11);
            doc.setTextColor(0, 0, 0);
            const titleLines = doc.splitTextToSize(title, colWidth - 8);
            doc.text(titleLines, x + 4, y + 6);

            // Duration
            doc.setFont(undefined, 'normal');
            doc.setFontSize(9);
            doc.text(duration, x + 4, y + 14);

            // Description
            const descLines = doc.splitTextToSize(desc, colWidth - 8);
            doc.text(descLines, x + 4, y + 20);

            // Live Link
            if (link) {
                doc.setTextColor(0, 114, 255);
                doc.setFontSize(9);
                doc.textWithLink('Live Demo', x + 4, y + boxHeight - 6, { url: link });
            }

            // Move to next column or row
            x += colWidth + horizontalGap;
            projectsInRow++;

            if (projectsInRow === 2) {
                y += boxHeight + 10;
                x = 14;
                projectsInRow = 0;
            }
        });

        // If last row had only one project, move y down
        if (projectsInRow !== 0) {
            y += boxHeight + 10;
        }
    }



    function addSkillsSection() {
        const skillsInputs = document.querySelectorAll('input[name="skills-item"]');
        const skills = Array.from(skillsInputs).map(i => i.value.trim()).filter(s => s.length);
        if (!skills.length) return;
        ensureSpace(3);
        y += 10;
        doc.setFontSize(16);
        doc.setTextColor(0, 114, 255);
        doc.text('Skills', marginLeft, y);
        y += 8;

        doc.setFontSize(12);
        doc.setTextColor(30, 30, 30);

        // Draw skills in 4 columns horizontally
        const colCount = 4;
        const colWidth = 45;
        let rowHeight = 7;
        let startX = marginLeft;
        let startY = y;

        skills.forEach((skill, idx) => {
            let col = idx % colCount;
            let row = Math.floor(idx / colCount);
            let x = startX + col * colWidth;
            let yPos = startY + row * rowHeight;
            doc.text(skill, x, yPos);
        });

        y += Math.ceil(skills.length / colCount) * rowHeight + 5;
    }

    function formatMonthYear(dateStr) {
        if (!dateStr) return '';
        let d = new Date(dateStr + '-01');
        let options = { year: 'numeric', month: 'short' };
        return d.toLocaleDateString('en-US', options);
    }
}
