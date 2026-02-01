#!/usr/bin/env python3
"""
Project Analysis Script for World Crop Monitor 1.0
Analyzes all functions, components, and architecture/tech stack used in the project.
Generates comprehensive documentation of the codebase structure.
"""

import os
import ast
import json
import re
from pathlib import Path
from typing import Dict, List, Tuple, Any
from collections import defaultdict


class ProjectAnalyzer:
    """Analyzes project structure, tech stack, and all functions."""

    def __init__(self, project_root: str):
        self.project_root = Path(project_root)
        self.python_files = []
        self.typescript_files = []
        self.javascript_files = []
        self.tech_stack = {
            "backend": {},
            "frontend": {},
            "api": {},
            "dependencies": defaultdict(list),
        }
        self.functions = defaultdict(list)
        self.classes = defaultdict(list)
        self.services = defaultdict(list)
        self.components = defaultdict(list)

    def discover_files(self) -> None:
        """Discover all relevant source files in the project."""
        print("📁 Discovering project files...")
        
        for root, dirs, files in os.walk(self.project_root):
            # Skip node_modules and virtual environments
            dirs[:] = [d for d in dirs if d not in ['node_modules', 'venv', 'env', '__pycache__', '.venv']]
            
            for file in files:
                file_path = Path(root) / file
                relative_path = file_path.relative_to(self.project_root)
                
                if file.endswith('.py'):
                    self.python_files.append(relative_path)
                elif file.endswith('.ts'):
                    self.typescript_files.append(relative_path)
                elif file.endswith('.js') and 'node_modules' not in str(file_path):
                    self.javascript_files.append(relative_path)
        
        print(f"✓ Found {len(self.python_files)} Python files")
        print(f"✓ Found {len(self.typescript_files)} TypeScript files")
        print(f"✓ Found {len(self.javascript_files)} JavaScript files")

    def analyze_tech_stack(self) -> None:
        """Analyze and document the technology stack."""
        print("\n🔧 Analyzing Technology Stack...")
        
        # Backend
        backend_package = self.project_root / "package.json"
        if backend_package.exists():
            with open(backend_package) as f:
                pkg = json.load(f)
                self.tech_stack["backend"]["Node.js"] = pkg.get("version", "Unknown")
                self.tech_stack["dependencies"]["Backend"] = list(pkg.get("dependencies", {}).keys())
        
        # Frontend
        frontend_package = self.project_root / "climatemaps" / "client" / "package.json"
        if frontend_package.exists():
            with open(frontend_package) as f:
                pkg = json.load(f)
                if "dependencies" in pkg:
                    self.tech_stack["frontend"]["Angular"] = self._extract_version(
                        pkg["dependencies"].get("@angular/core", "latest")
                    )
                    self.tech_stack["dependencies"]["Frontend"] = list(pkg.get("dependencies", {}).keys())
        
        # Python Dependencies
        requirements = self.project_root / "climatemaps" / "requirements.txt"
        if requirements.exists():
            with open(requirements) as f:
                deps = [line.strip() for line in f if line.strip() and not line.startswith('#')]
                self.tech_stack["dependencies"]["Python"] = deps

    def _extract_version(self, version_str: str) -> str:
        """Extract version from package string."""
        return version_str.replace("^", "").replace("~", "").split()[0]

    def analyze_python_files(self) -> None:
        """Analyze Python files for functions, classes, and documentation."""
        print("\n🐍 Analyzing Python Files...")
        
        for file_path in self.python_files:
            full_path = self.project_root / file_path
            try:
                with open(full_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                tree = ast.parse(content)
                self._extract_python_components(tree, str(file_path))
            except Exception as e:
                print(f"  ⚠ Error parsing {file_path}: {e}")

    def _extract_python_components(self, tree: ast.AST, file_path: str) -> None:
        """Extract functions and classes from Python AST."""
        module_key = f"climatemaps/{file_path}"
        
        for node in ast.walk(tree):
            if isinstance(node, ast.FunctionDef):
                self.functions[module_key].append({
                    "name": node.name,
                    "lineno": node.lineno,
                    "args": [arg.arg for arg in node.args.args],
                    "docstring": ast.get_docstring(node) or "No documentation",
                    "type": "Function"
                })
            
            elif isinstance(node, ast.ClassDef):
                docstring = ast.get_docstring(node) or "No documentation"
                class_info = {
                    "name": node.name,
                    "lineno": node.lineno,
                    "docstring": docstring,
                    "methods": []
                }
                
                for item in node.body:
                    if isinstance(item, ast.FunctionDef):
                        class_info["methods"].append({
                            "name": item.name,
                            "args": [arg.arg for arg in item.args.args],
                            "docstring": ast.get_docstring(item) or "No documentation"
                        })
                
                self.classes[module_key].append(class_info)

    def analyze_typescript_files(self) -> None:
        """Analyze TypeScript files for services and components."""
        print("\n📘 Analyzing TypeScript Files...")
        
        for file_path in self.typescript_files:
            full_path = self.project_root / file_path
            try:
                with open(full_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Extract component/service information
                if 'service.ts' in str(file_path):
                    self._extract_typescript_service(content, str(file_path))
                elif 'component.ts' in str(file_path):
                    self._extract_angular_component(content, str(file_path))
                else:
                    self._extract_typescript_functions(content, str(file_path))
            
            except Exception as e:
                print(f"  ⚠ Error parsing {file_path}: {e}")

    def _extract_typescript_service(self, content: str, file_path: str) -> None:
        """Extract Angular service information."""
        class_match = re.search(r'export class (\w+)', content)
        if class_match:
            class_name = class_match.group(1)
            methods = re.findall(r'^\s{2}(\w+)\s*\([^)]*\)\s*(?::|:.*?{)', content, re.MULTILINE)
            
            self.services[file_path] = {
                "name": class_name,
                "methods": list(set(methods)),
                "file": file_path
            }

    def _extract_angular_component(self, content: str, file_path: str) -> None:
        """Extract Angular component information."""
        class_match = re.search(r'export class (\w+)', content)
        if class_match:
            class_name = class_match.group(1)
            decorator = re.search(r'@Component\({([^}]+)}\)', content, re.DOTALL)
            
            component_info = {
                "name": class_name,
                "file": file_path,
                "selectors": re.findall(r"selector:\s*['\"]([^'\"]+)['\"]", content),
                "templateUrl": re.findall(r"templateUrl:\s*['\"]([^'\"]+)['\"]", content),
                "styleUrls": re.findall(r"styleUrls:\s*\[\s*['\"]([^'\"]+)['\"]", content)
            }
            
            self.components[file_path] = component_info

    def _extract_typescript_functions(self, content: str, file_path: str) -> None:
        """Extract TypeScript functions."""
        # Find exported functions
        functions = re.findall(
            r'export\s+(?:async\s+)?function\s+(\w+)\s*\(([^)]*)\)',
            content
        )
        
        if functions:
            self.functions[file_path] = [
                {
                    "name": name,
                    "parameters": params.split(','),
                    "type": "Function"
                }
                for name, params in functions
            ]

    def generate_report(self, output_file: str = None) -> str:
        """Generate comprehensive analysis report."""
        print("\n📊 Generating Analysis Report...")
        
        report = []
        report.append("=" * 80)
        report.append("PROJECT ANALYSIS REPORT: World Crop Monitor 1.0")
        report.append("=" * 80)
        report.append("")
        
        # 1. Technology Stack Overview
        report.append("1. TECHNOLOGY STACK OVERVIEW")
        report.append("-" * 80)
        report.append("")
        report.append("Backend Technology:")
        report.append(f"  • Node.js Application (Express.js)")
        report.append(f"  • Server: backend/server.js")
        report.append("")
        report.append("Frontend Technology:")
        report.append(f"  • Angular (Latest)")
        report.append(f"  • TypeScript")
        report.append(f"  • SCSS for styling")
        report.append(f"  • ESLint for code quality")
        report.append("")
        report.append("Backend API Technology:")
        report.append(f"  • Python 3.9+")
        report.append(f"  • Flask-based REST API")
        report.append(f"  • Docker containerized")
        report.append("")
        
        # Backend Dependencies
        if self.tech_stack["dependencies"].get("Backend"):
            report.append("Backend Dependencies:")
            for dep in self.tech_stack["dependencies"]["Backend"]:
                report.append(f"  • {dep}")
            report.append("")
        
        # Frontend Dependencies
        if self.tech_stack["dependencies"].get("Frontend"):
            report.append("Frontend Dependencies (Key):")
            key_deps = [d for d in self.tech_stack["dependencies"]["Frontend"][:10]]
            for dep in key_deps:
                report.append(f"  • {dep}")
            if len(self.tech_stack["dependencies"]["Frontend"]) > 10:
                report.append(f"  ... and {len(self.tech_stack['dependencies']['Frontend']) - 10} more")
            report.append("")
        
        # Python Dependencies
        if self.tech_stack["dependencies"].get("Python"):
            report.append("Python API Dependencies:")
            for dep in self.tech_stack["dependencies"]["Python"][:15]:
                report.append(f"  • {dep}")
            if len(self.tech_stack["dependencies"]["Python"]) > 15:
                report.append(f"  ... and {len(self.tech_stack['dependencies']['Python']) - 15} more")
            report.append("")
        
        # 2. Project Architecture
        report.append("\n2. PROJECT ARCHITECTURE")
        report.append("-" * 80)
        report.append("")
        report.append("Directory Structure:")
        report.append("  backend/")
        report.append("    └── server.js - Express.js backend server")
        report.append("")
        report.append("  climatemaps/")
        report.append("    ├── api/ - Python REST API with Flask")
        report.append("    │   ├── main.py - API entry point")
        report.append("    │   ├── middleware.py - Request/response middleware")
        report.append("    │   └── cache.py - Caching layer")
        report.append("    ├── client/ - Angular frontend application")
        report.append("    │   └── src/")
        report.append("    │       ├── app/ - Angular components and services")
        report.append("    │       ├── assets/ - Static assets")
        report.append("    │       ├── styles/ - Global SCSS styles")
        report.append("    │       └── environments/ - Environment configs")
        report.append("    └── climatemaps/ - Core Python modules")
        report.append("        ├── contour.py - Contour generation")
        report.append("        ├── tile.py - Tile server integration")
        report.append("        ├── data.py - Data processing")
        report.append("        └── datasets.py - Dataset management")
        report.append("")
        report.append("  Data Layer:")
        report.append("    └── data/")
        report.append("        ├── raw/ - Raw GeoJSON and boundary data")
        report.append("        └── tiles/ - Vector tiles for visualization")
        report.append("")
        report.append("  Infrastructure:")
        report.append("    └── infra/")
        report.append("        └── openclimatemap.nginx.conf - Nginx configuration")
        report.append("")
        
        # 3. Python Functions and Classes
        report.append("\n3. PYTHON FUNCTIONS & CLASSES")
        report.append("-" * 80)
        report.append("")
        
        if self.classes:
            report.append("Classes Found:")
            for file_path, classes in sorted(self.classes.items()):
                report.append(f"\n  File: {file_path}")
                for cls in classes:
                    report.append(f"    Class: {cls['name']}")
                    report.append(f"      Docstring: {cls['docstring'][:100]}")
                    if cls['methods']:
                        report.append(f"      Methods ({len(cls['methods'])}):")
                        for method in cls['methods'][:5]:
                            report.append(f"        • {method['name']}({', '.join(method['args'])})")
                        if len(cls['methods']) > 5:
                            report.append(f"        ... and {len(cls['methods']) - 5} more methods")
                    report.append("")
        
        if self.functions:
            report.append("\nFunctions Found:")
            for file_path, functions in sorted(self.functions.items()):
                if file_path.endswith('.py'):
                    report.append(f"\n  File: {file_path}")
                    for func in functions[:8]:
                        report.append(f"    • {func['name']}({', '.join(func['args'])})")
                        report.append(f"      {func['docstring'][:80]}...")
                    if len(functions) > 8:
                        report.append(f"    ... and {len(functions) - 8} more functions")
        
        # 4. Angular Components & Services
        report.append("\n\n4. ANGULAR COMPONENTS & SERVICES")
        report.append("-" * 80)
        report.append("")
        
        if self.components:
            report.append("Components:")
            for file_path, component in sorted(self.components.items()):
                report.append(f"\n  {component['name']}")
                report.append(f"    File: {file_path}")
                if component['selectors']:
                    report.append(f"    Selector: {component['selectors'][0]}")
                if component['templateUrl']:
                    report.append(f"    Template: {component['templateUrl'][0]}")
                if component['styleUrls']:
                    report.append(f"    Styles: {', '.join(component['styleUrls'])}")
        
        if self.services:
            report.append("\n\nServices:")
            for file_path, service in sorted(self.services.items()):
                report.append(f"\n  {service['name']}")
                report.append(f"    File: {file_path}")
                if service['methods']:
                    report.append(f"    Methods: {', '.join(service['methods'][:5])}")
                    if len(service['methods']) > 5:
                        report.append(f"             ... and {len(service['methods']) - 5} more")
        
        # 5. Core Modules Documentation
        report.append("\n\n5. CORE PYTHON MODULES")
        report.append("-" * 80)
        report.append("")
        
        core_modules = {
            "contour.py": "Contour/isoline generation from climate data",
            "tile.py": "Vector tile generation and serving",
            "data.py": "Data loading and preprocessing",
            "datasets.py": "Dataset registry and management",
            "download.py": "Climate data downloading from external sources",
            "ensemble.py": "Ensemble climate model processing",
            "geogrid.py": "Geographic grid operations and transformations",
            "geotiff.py": "GeoTIFF file format handling",
            "config.py": "Application configuration management",
            "logger.py": "Logging utilities"
        }
        
        for module, description in core_modules.items():
            report.append(f"  • {module}")
            report.append(f"    └─ {description}")
        
        report.append("")
        
        # 6. Key Features
        report.append("\n6. KEY FEATURES IMPLEMENTED")
        report.append("-" * 80)
        report.append("")
        report.append("Climate Visualization:")
        report.append("  • Interactive global map with climate data visualization")
        report.append("  • Support for multiple climate variables (temperature, precipitation)")
        report.append("  • CMIP5/CMIP6 climate scenario support")
        report.append("  • High-resolution tile-based rendering")
        report.append("")
        report.append("Crop Stress Monitoring:")
        report.append("  • Multi-indicator stress tracking")
        report.append("  • Risk classification (Critical, High, Medium, Low)")
        report.append("  • Trend analysis and historical tracking")
        report.append("  • Data export (JSON/CSV)")
        report.append("")
        report.append("Technical Features:")
        report.append("  • Geospatial data processing (NetCDF, GeoTIFF)")
        report.append("  • Vector tile optimization")
        report.append("  • Caching layer for performance")
        report.append("  • Docker containerization")
        report.append("  • Nginx reverse proxy")
        report.append("")
        
        # 7. Data Flow
        report.append("\n7. DATA FLOW")
        report.append("-" * 80)
        report.append("")
        report.append("User Request → Angular Frontend → Express Backend → Python API")
        report.append("                                                        ↓")
        report.append("                                              Data Processing")
        report.append("                                              (GeoGrid, Tile Generation)")
        report.append("                                                        ↓")
        report.append("                                              Vector Tile Server")
        report.append("                                                        ↓")
        report.append("                                              Client Visualization")
        report.append("")
        
        # 8. Summary Statistics
        report.append("\n8. CODEBASE STATISTICS")
        report.append("-" * 80)
        report.append("")
        report.append(f"Python Files: {len(self.python_files)}")
        report.append(f"TypeScript Files: {len(self.typescript_files)}")
        report.append(f"JavaScript Files: {len(self.javascript_files)}")
        report.append(f"Total Python Functions: {sum(len(v) for k, v in self.functions.items() if k.endswith('.py'))}")
        report.append(f"Total Python Classes: {sum(len(v) for v in self.classes.values())}")
        report.append(f"Angular Components: {len(self.components)}")
        report.append(f"Angular Services: {len(self.services)}")
        report.append("")
        
        # 9. Development Scripts
        report.append("\n9. AVAILABLE SCRIPTS")
        report.append("-" * 80)
        report.append("")
        report.append("  • scripts/create_contour.py - Generate contour lines from data")
        report.append("  • scripts/create_ensemble_mean.py - Compute ensemble averages")
        report.append("  • scripts/create_tileserver_config.py - Generate tile server config")
        report.append("  • scripts/download_tiles.sh - Download pre-rendered tiles")
        report.append("  • scripts/deploy.sh - Full deployment pipeline")
        report.append("  • scripts/deploy_backend.sh - Backend deployment")
        report.append("  • scripts/deploy_client.sh - Frontend deployment")
        report.append("")
        
        report.append("=" * 80)
        report.append("End of Analysis Report")
        report.append("=" * 80)
        
        report_text = "\n".join(report)
        
        # Save to file if specified
        if output_file:
            output_path = Path(output_file)
            output_path.parent.mkdir(parents=True, exist_ok=True)
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(report_text)
            print(f"\n✓ Report saved to {output_file}")
        
        return report_text

    def generate_json_report(self, output_file: str = None) -> Dict[str, Any]:
        """Generate structured JSON report for programmatic access."""
        print("\n📋 Generating JSON Report...")
        
        json_report = {
            "project": "World Crop Monitor 1.0",
            "description": "Global Food Security Early Warning System",
            "codebase_stats": {
                "python_files": len(self.python_files),
                "typescript_files": len(self.typescript_files),
                "javascript_files": len(self.javascript_files),
                "total_classes": sum(len(v) for v in self.classes.values()),
                "total_functions": sum(len(v) for v in self.functions.values()),
                "total_components": len(self.components),
                "total_services": len(self.services)
            },
            "technology_stack": {
                "backend": ["Node.js", "Express.js"],
                "frontend": ["Angular", "TypeScript", "SCSS"],
                "api": ["Python 3.9+", "Flask"],
                "infrastructure": ["Docker", "Nginx", "TileServer"],
                "databases": ["Supports various geo-data formats: NetCDF, GeoTIFF"]
            },
            "core_modules": {
                "contour.py": "Contour/isoline generation from climate data",
                "tile.py": "Vector tile generation and serving",
                "data.py": "Data loading and preprocessing",
                "datasets.py": "Dataset registry and management",
                "download.py": "Climate data downloading",
                "ensemble.py": "Ensemble model processing",
                "geogrid.py": "Geographic grid operations",
                "geotiff.py": "GeoTIFF file handling"
            },
            "python_modules": {
                str(k): [
                    {
                        "name": f["name"],
                        "type": f.get("type", "Function"),
                        "args": f.get("args", []),
                        "docstring": f.get("docstring", "")[:100]
                    }
                    for f in v[:5]
                ]
                for k, v in list(self.functions.items())[:10]
            },
            "services": {str(k): v for k, v in list(self.services.items())[:10]},
            "components": {str(k): v for k, v in list(self.components.items())[:10]},
            "architecture": {
                "layers": {
                    "frontend": "Angular SPA with interactive maps",
                    "backend": "Express.js proxy and coordination",
                    "api": "Python REST API for data processing",
                    "data": "Geospatial data processing and tiles"
                },
                "features": [
                    "Interactive climate visualization",
                    "Crop stress monitoring",
                    "Vector tile rendering",
                    "Data caching and optimization",
                    "Export functionality",
                    "Multi-scenario support"
                ]
            }
        }
        
        if output_file:
            output_path = Path(output_file)
            output_path.parent.mkdir(parents=True, exist_ok=True)
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(json_report, f, indent=2)
            print(f"✓ JSON report saved to {output_file}")
        
        return json_report


def main():
    """Main entry point."""
    import sys
    
    project_root = sys.argv[1] if len(sys.argv) > 1 else "."
    
    print("🚀 Starting Project Analysis...\n")
    
    analyzer = ProjectAnalyzer(project_root)
    analyzer.discover_files()
    analyzer.analyze_tech_stack()
    analyzer.analyze_python_files()
    analyzer.analyze_typescript_files()
    
    # Generate reports
    text_report = analyzer.generate_report(f"{project_root}/PROJECT_ANALYSIS.md")
    json_report = analyzer.generate_json_report(f"{project_root}/PROJECT_ANALYSIS.json")
    
    print("\n" + text_report)
    print("\n✅ Analysis Complete!")
    print(f"\nReports generated:")
    print(f"  📄 Markdown: PROJECT_ANALYSIS.md")
    print(f"  📊 JSON: PROJECT_ANALYSIS.json")


if __name__ == "__main__":
    main()
