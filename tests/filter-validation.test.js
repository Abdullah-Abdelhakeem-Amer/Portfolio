/**
 * Filter Validation Tests
 * Validates that the technology-based filters work correctly
 */

const fs = require('fs');
const path = require('path');

function testFilterCounts() {
    console.log('\n🧪 Testing Filter Counts...\n');
    
    try {
        const projectsData = JSON.parse(
            fs.readFileSync(path.join(__dirname, '../data/projects.json'), 'utf8')
        );
        
        const projects = projectsData.featured || [];
        
        // Count projects per filter
        const counts = {
            all: projects.length,
            androidAutomotive: 0,
            embeddedLinux: 0,
            cpp: 0,
            aiMl: 0
        };
        
        projects.forEach(project => {
            const techStack = project.technologies.map(t => t.toLowerCase());
            
            // Android Automotive AOSP
            if (techStack.some(tech => 
                tech.includes('android automotive') || 
                tech.includes('aosp') ||
                tech.includes('aaos')
            ) || project.category === 'android') {
                counts.androidAutomotive++;
            }
            
            // Embedded Linux
            if (techStack.some(tech => 
                tech.includes('embedded linux') || 
                tech.includes('linux kernel') ||
                tech.includes('yocto') ||
                tech.includes('buildroot')
            ) || project.category === 'embedded') {
                counts.embeddedLinux++;
            }
            
            // C++
            if (techStack.some(tech => 
                tech.includes('c++') || 
                tech.includes('c/c++') ||
                tech === 'cpp'
            )) {
                counts.cpp++;
            }
            
            // AI & ML
            if (techStack.some(tech => 
                tech.includes('pytorch') ||
                tech.includes('tensorflow') ||
                tech.includes('llm') ||
                tech.includes('langchain') ||
                tech.includes('rag') ||
                tech.includes('ai agent') ||
                tech.includes('machine learning') ||
                tech.includes('computer vision') ||
                tech.includes('opencv') ||
                tech.includes('yolo') ||
                tech.includes('gan') ||
                tech.includes('diffusion') ||
                tech.includes('huggingface')
            ) || project.category === 'ai') {
                counts.aiMl++;
            }
        });
        
        console.log('═══════════════════════════════════════════');
        console.log('  Filter Count Results');
        console.log('═══════════════════════════════════════════');
        console.log(`Total Projects:              ${counts.all}`);
        console.log(`Android Automotive AOSP:     ${counts.androidAutomotive}`);
        console.log(`Embedded Linux:              ${counts.embeddedLinux}`);
        console.log(`C++ (14/17/20):              ${counts.cpp}`);
        console.log(`AI & ML:                     ${counts.aiMl}`);
        console.log('═══════════════════════════════════════════\n');
        
        // Verify that projects can appear in multiple filters
        const totalFiltered = counts.androidAutomotive + counts.embeddedLinux + counts.cpp + counts.aiMl;
        if (totalFiltered > counts.all) {
            console.log('✅ VERIFIED: Projects can appear in multiple filters (overlap detected)');
            console.log(`   Total filtered count (${totalFiltered}) > Total projects (${counts.all})\n`);
        } else {
            console.log('⚠️  WARNING: No filter overlap detected (all projects in single categories)\n');
        }
        
        // List some examples of multi-filter projects
        console.log('Examples of projects matching multiple filters:\n');
        let exampleCount = 0;
        projects.forEach(project => {
            const techStack = project.technologies.map(t => t.toLowerCase());
            const matches = [];
            
            if (techStack.some(t => t.includes('android automotive') || t.includes('aosp') || t.includes('aaos')) || project.category === 'android') {
                matches.push('Android Automotive AOSP');
            }
            if (techStack.some(t => t.includes('embedded linux') || t.includes('linux kernel') || t.includes('yocto') || t.includes('buildroot')) || project.category === 'embedded') {
                matches.push('Embedded Linux');
            }
            if (techStack.some(t => t.includes('c++') || t.includes('c/c++'))) {
                matches.push('C++');
            }
            if (techStack.some(t => t.includes('pytorch') || t.includes('tensorflow') || t.includes('opencv') || t.includes('llm') || t.includes('langchain')) || project.category === 'ai') {
                matches.push('AI & ML');
            }
            
            if (matches.length > 1 && exampleCount < 5) {
                console.log(`  ${project.title}`);
                console.log(`    Filters: ${matches.join(', ')}`);
                console.log(`    Technologies: ${project.technologies.slice(0, 4).join(', ')}...\n`);
                exampleCount++;
            }
        });
        
        return true;
    } catch (error) {
        console.log(`❌ FAILED: Error reading projects.json - ${error.message}`);
        return false;
    }
}

// Run test
if (require.main === module) {
    console.log('═══════════════════════════════════════════════════════');
    console.log('  Technology-Based Filter Validation');
    console.log('═══════════════════════════════════════════════════════');
    testFilterCounts();
}

module.exports = { testFilterCounts };



