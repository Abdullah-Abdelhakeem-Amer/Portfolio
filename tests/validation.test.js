/**
 * Validation Tests for Portfolio Website Updates
 * Feature: Startups and Projects Enhancement
 * 
 * Tests validate:
 * 1. All projects have action links (View Code, Watch Demo, LinkedIn)
 * 2. Startups index lists three startups
 * 3. Services list contains "C++"
 */

const fs = require('fs');
const path = require('path');

// Test 1: Validate all projects have required fields
function testProjectsHaveActionLinks() {
    console.log('\n🧪 Test 1: Validating projects have action links...');
    
    try {
        const projectsData = JSON.parse(
            fs.readFileSync(path.join(__dirname, '../data/projects.json'), 'utf8')
        );
        
        const projects = projectsData.featured || [];
        let passed = true;
        let issues = [];
        
        projects.forEach((project, index) => {
            // Check that project has required fields
            if (!project.title) {
                issues.push(`Project ${index + 1}: Missing title`);
                passed = false;
            }
            
            // Check that project has at least github, youtube, or linkedin field
            if (!project.github && !project.youtube && !project.linkedin) {
                issues.push(`Project "${project.title}": Missing action links (github, youtube, or linkedin)`);
                passed = false;
            }
            
            // Verify role, technologies, and description exist
            if (!project.role) {
                issues.push(`Project "${project.title}": Missing role`);
                passed = false;
            }
            
            if (!project.technologies || !Array.isArray(project.technologies) || project.technologies.length === 0) {
                issues.push(`Project "${project.title}": Missing or empty technologies array`);
                passed = false;
            }
            
            if (!project.description) {
                issues.push(`Project "${project.title}": Missing description`);
                passed = false;
            }
            
            if (!project.impact) {
                issues.push(`Project "${project.title}": Missing impact`);
                passed = false;
            }
        });
        
        if (passed) {
            console.log(`✅ PASSED: All ${projects.length} projects have required action links and fields`);
            return true;
        } else {
            console.log(`❌ FAILED: Issues found:`);
            issues.forEach(issue => console.log(`   - ${issue}`));
            return false;
        }
    } catch (error) {
        console.log(`❌ FAILED: Error reading projects.json - ${error.message}`);
        return false;
    }
}

// Test 2: Validate startups index lists three startups
function testStartupsIndexHasThreeStartups() {
    console.log('\n🧪 Test 2: Validating startups index has three startups...');
    
    try {
        const startupsIndex = fs.readFileSync(
            path.join(__dirname, '../startups/index.html'),
            'utf8'
        );
        
        // Check for the three startup names
        const hasAospcamp = startupsIndex.includes('aospcamp');
        const hasPcodecamp = startupsIndex.includes('pcodecamp');
        const hasBitPulse = startupsIndex.includes('BitPulse');
        
        // Check for links to individual pages
        const hasAospcampLink = startupsIndex.includes('./aospcamp.html');
        const hasPcodecampLink = startupsIndex.includes('./pcodecamp.html');
        const hasBitPulseLink = startupsIndex.includes('./bitpulse.html');
        
        if (hasAospcamp && hasPcodecamp && hasBitPulse && 
            hasAospcampLink && hasPcodecampLink && hasBitPulseLink) {
            console.log('✅ PASSED: Startups index lists all three startups (aospcamp, pcodecamp, BitPulse)');
            return true;
        } else {
            console.log('❌ FAILED: Startups index is missing one or more startups');
            console.log(`   - aospcamp: ${hasAospcamp ? '✓' : '✗'} (link: ${hasAospcampLink ? '✓' : '✗'})`);
            console.log(`   - pcodecamp: ${hasPcodecamp ? '✓' : '✗'} (link: ${hasPcodecampLink ? '✓' : '✗'})`);
            console.log(`   - BitPulse: ${hasBitPulse ? '✓' : '✗'} (link: ${hasBitPulseLink ? '✓' : '✗'})`);
            return false;
        }
    } catch (error) {
        console.log(`❌ FAILED: Error reading startups/index.html - ${error.message}`);
        return false;
    }
}

// Test 3: Validate services list contains C++
function testServicesContainsCpp() {
    console.log('\n🧪 Test 3: Validating services list contains C++...');
    
    try {
        const indexHtml = fs.readFileSync(
            path.join(__dirname, '../index.html'),
            'utf8'
        );
        
        // Check for C++ service card in main page
        const hasCppServiceCard = indexHtml.includes('C++ Development');
        const hasCppServiceLink = indexHtml.includes('./services/cpp-development.html');
        
        // Check that C++ service page exists
        const cppServicePageExists = fs.existsSync(
            path.join(__dirname, '../services/cpp-development.html')
        );
        
        if (hasCppServiceCard && hasCppServiceLink && cppServicePageExists) {
            console.log('✅ PASSED: Services list contains "C++ Development"');
            console.log('   - Service card in index.html: ✓');
            console.log('   - Service link present: ✓');
            console.log('   - Service page exists: ✓');
            return true;
        } else {
            console.log('❌ FAILED: C++ service not fully implemented');
            console.log(`   - Service card in index.html: ${hasCppServiceCard ? '✓' : '✗'}`);
            console.log(`   - Service link present: ${hasCppServiceLink ? '✓' : '✗'}`);
            console.log(`   - Service page exists: ${cppServicePageExists ? '✓' : '✗'}`);
            return false;
        }
    } catch (error) {
        console.log(`❌ FAILED: Error validating services - ${error.message}`);
        return false;
    }
}

// Test 4: Validate project count meets requirements
function testProjectCount() {
    console.log('\n🧪 Test 4: Validating project count meets requirements...');
    
    try {
        const projectsData = JSON.parse(
            fs.readFileSync(path.join(__dirname, '../data/projects.json'), 'utf8')
        );
        
        const projects = projectsData.featured || [];
        const expectedProjects = [
            'SeiDrive IVI',
            'AutoCore Dashboard',
            'DriveSense IVI',
            'MotionSync IVI',
            'AutoControl HAL',
            'VisionDrive IVI',
            'AOSP Custom ROM',
            'Embedded Android & AOSP Training',
            'Radar Rollout Gen5 - Porsche',
            'Radar Rollout Gen5 – VW02 & VW04',
            'Driver Monitoring Systems (DMS) – Autosar Team',
            'Driver Monitoring Systems (DMS) – Application Team',
            'ICG – In Cabin Guard',
            'Cluster Display Product',
            'Cybersecurity Stack Implementation',
            'SEIHUB'
        ];
        
        const projectTitles = projects.map(p => p.title);
        const missingProjects = expectedProjects.filter(expected => 
            !projectTitles.some(title => title.includes(expected.split('–')[0].trim()))
        );
        
        if (missingProjects.length === 0 && projects.length >= 16) {
            console.log(`✅ PASSED: All required projects present (Total: ${projects.length})`);
            return true;
        } else {
            console.log(`❌ FAILED: Missing required projects`);
            console.log(`   Total projects: ${projects.length}`);
            if (missingProjects.length > 0) {
                console.log(`   Missing projects:`);
                missingProjects.forEach(p => console.log(`     - ${p}`));
            }
            return false;
        }
    } catch (error) {
        console.log(`❌ FAILED: Error validating project count - ${error.message}`);
        return false;
    }
}

// Run all tests
function runAllTests() {
    console.log('═══════════════════════════════════════════════════════');
    console.log('  Portfolio Website Validation Tests');
    console.log('  Feature: Startups and Projects Enhancement');
    console.log('═══════════════════════════════════════════════════════');
    
    const results = {
        test1: testProjectsHaveActionLinks(),
        test2: testStartupsIndexHasThreeStartups(),
        test3: testServicesContainsCpp(),
        test4: testProjectCount()
    };
    
    const totalTests = Object.keys(results).length;
    const passedTests = Object.values(results).filter(r => r === true).length;
    
    console.log('\n═══════════════════════════════════════════════════════');
    console.log(`  Test Results: ${passedTests}/${totalTests} passed`);
    console.log('═══════════════════════════════════════════════════════\n');
    
    if (passedTests === totalTests) {
        console.log('🎉 All tests passed! Ready for deployment.\n');
        process.exit(0);
    } else {
        console.log('⚠️  Some tests failed. Please review the issues above.\n');
        process.exit(1);
    }
}

// Run tests
if (require.main === module) {
    runAllTests();
}

module.exports = {
    testProjectsHaveActionLinks,
    testStartupsIndexHasThreeStartups,
    testServicesContainsCpp,
    testProjectCount
};

