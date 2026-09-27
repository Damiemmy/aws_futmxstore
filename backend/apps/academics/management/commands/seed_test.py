from django.core.management.base import BaseCommand
from django.utils.text import slugify

from apps.academics.models import (
    Faculty,
    Department,
    Level,
    Semester,
    Course,
)


class Command(BaseCommand):
    help = "Seed FUT Minna faculties, departments, levels, semesters and courses."

    def handle(self, *args, **options):

        faculties = {
            "SAMET": {
                "name": "School of Agricultural Management & Extension Technology",
                "departments": [
                    "Agricultural Economics and Farm Management",
                    "Agricultural Extension and Rural Development",
                    "Agribusiness",
                ],
            },
            "SAFT": {
                "name": "School of Agronomy & Forestry Technology",
                "departments": [
                    "Crop Production",
                    "Soil Science and Land Management",
                    "Horticulture",
                    "Forestry and Wildlife Technology",
                ],
            },
            "SFAT": {
                "name": "School of Food Science & Agricultural Technology",
                "departments": [
                    "Animal Production",
                    "Food Science and Technology",
                    "Water Resources, Aquaculture and Fisheries Technology",
                    "Human Nutrition and Dietetics",
                ],
            },
            "SAT": {
                "name": "School of Architectural Technology",
                "departments": [
                    "Architecture",
                    "Interior Architecture and Design",
                    "Landscaping Architecture",
                    "Furniture Design Architecture",
                ],
            },
            "SET": {
                "name": "School of Environmental Technology",
                "departments": [
                    "Building",
                    "Estate Management & Valuation",
                    "Quantity Surveying",
                    "Surveying and Geoinformatics",
                    "Urban and Regional Planning",
                ],
            },
            "SEET": {
                "name": "School of Electrical Engineering & Technology",
                "departments": [
                    "Computer Engineering",
                    "Electrical/Electronic Engineering",
                    "Mechatronics Engineering",
                    "Telecommunication Engineering",
                ],
            },
            "SIPET": {
                "name": "School of Infrastructure, Process Engineering & Technology",
                "departments": [
                    "Agricultural and Bioresources Engineering",
                    "Chemical Engineering",
                    "Civil Engineering",
                    "Mechanical Engineering",
                    "Materials and Metallurgical Engineering",
                    "Petroleum and Gas Engineering",
                    "Food Engineering",
                ],
            },
            "SICT": {
                "name": "School of Information & Communication Technology",
                "departments": [
                    "Computer Science",
                    "Cyber Security Science",
                    "Information Technology",
                    "Information Science and Media Studies",
                    "Data Science",
                    "Software Engineering",
                ],
            },
            "SIT": {
                "name": "School of Innovative Technology",
                "departments": [
                    "Entrepreneurship",
                    "Logistics and Transport Technology",
                    "Project Management Technology",
                ],
            },
            "SLS": {
                "name": "School of Life Sciences",
                "departments": [
                    "Animal Biology",
                    "Plant Biology",
                    "Biochemistry",
                    "Microbiology",
                    "Forensic Science",
                    "Public Health",
                    "Biotechnology",
                ],
            },
            "SPS": {
                "name": "School of Physical Sciences",
                "departments": [
                    "Chemistry",
                    "Physics",
                    "Mathematics",
                    "Industrial Mathematics",
                    "Statistics",
                    "Geology",
                    "Geography",
                    "Applied Geophysics",
                    "Meteorology",
                ],
            },
            "SSTE": {
                "name": "School of Science & Technology Education",
                "departments": [
                    "Educational Technology",
                    "Library and Information Science",
                    "Industrial and Technology Education",
                    "Science Education",
                ],
            },
            "SBMS": {
                "name": "School of Basic Medical Sciences",
                "departments": [
                    "Medicine and Surgery",
                    "Human Anatomy",
                    "Human Physiology",
                ],
            },
            "SAHS": {
                "name": "School of Allied Health Sciences",
                "departments": [
                    "Nursing Science",
                    "Medical Laboratory Science",
                ],
            },
            "SPhS": {
                "name": "School of Pharmaceutical Sciences",
                "departments": [
                    "Doctor of Pharmacy (Pharm. D.)",
                ],
            },
        }

        levels = ["100 Level", "200 Level", "300 Level", "400 Level", "500 Level"]
        semesters = ["First Semester", "Second Semester"]

        # ============================================================
        # COURSES DATA (from the two registration forms)
        # ============================================================
        # Key structure: department_name → level_name → semester_name → list of courses
        courses_data = {
            "Library and Information Science": {
                "100 Level": {
                    "First Semester": [
                        {"code": "FUTM-LIS112", "title": "Library Routines", "unit": 2},
                        {"code": "FUTM-LIS113", "title": "Library and Society", "unit": 3},
                        {"code": "GST111", "title": "Communication in English", "unit": 2},
                        {"code": "GST112", "title": "Nigerian Peoples and Culture", "unit": 2},
                        {"code": "LIS111", "title": "Introduction to Library and Information Science", "unit": 2},
                        {"code": "LIS114", "title": "Introduction to Digital Libraries", "unit": 2},
                        {"code": "PHY101", "title": "General Physics I", "unit": 2},
                        {"code": "MTH101", "title": "Elementary Mathematics 1", "unit": 3},
                    ],
                    "Second Semester": [
                        {"code": "EDU101", "title": "Introduction to Teaching and Foundations of Education", "unit": 2},
                        {"code": "FUTM-LIS123", "title": "Information Sources and Communication Media", "unit": 2},
                        {"code": "LIS125", "title": "Introduction to Library Application Packages", "unit": 2},
                        {"code": "PHY103", "title": "General Physics III", "unit": 2},
                        {"code": "FUTM-LIS122", "title": "Information Literacy", "unit": 3},
                        {"code": "FUTM-SED102", "title": "Physics Laboratory", "unit": 2},
                        {"code": "MTH102", "title": "Elementary Mathematics II", "unit": 3},
                    ],
                },
                "200 Level": {
                    "First Semester": [
                        {"code": "GST212", "title": "Philosophy, Logic, Environment and Sustainable Development", "unit": 2},
                        {"code": "FUTM-LIS213", "title": "Public, National, and School Libraries", "unit": 2},
                        {"code": "FUTM-LIS216", "title": "Information Management", "unit": 2},
                        {"code": "FUTM-LIS219", "title": "Information Re-packaging", "unit": 2},
                        {"code": "FUTM-LIS218", "title": "Internet and Library Website Design", "unit": 2},
                        {"code": "LIS215", "title": "Library and Information Services for Children and Adolescents", "unit": 2},
                        {"code": "LIS211", "title": "Introduction to ICT in LIS", "unit": 2},
                        {"code": "LIS214", "title": "Management of Libraries and Information", "unit": 2},
                    ],
                    "Second Semester": [
                        {"code": "EDU101", "title": "Introduction to Teaching and Foundations of Education", "unit": 2},
                        {"code": "EDU201", "title": "Curriculum, Curriculum Delivery and General Teaching Methods", "unit": 2},
                        {"code": "ENT211", "title": "Entrepreneurship and Innovation", "unit": 2},
                        {"code": "LIS216", "title": "Serials Management", "unit": 2},
                        {"code": "LIS222", "title": "Organisation of Knowledge I", "unit": 2},
                        {"code": "FUTM-LIS221", "title": "Data Science in Libraries", "unit": 2},
                        {"code": "FUTM-LIS226", "title": "Academic Libraries", "unit": 2},
                        {"code": "FUTM-LIS227", "title": "Information Services for the disadvantaged group", "unit": 2},
                        {"code": "FUTM-LIS222", "title": "Indigenous Knowledge System", "unit": 2},
                    ],
                },
            },
        }

        faculty_count = 0
        department_count = 0
        level_count = 0
        semester_count = 0
        course_count = 0

        # --------------------------------------------------------
        # 1. Seed Faculties → Departments → Levels → Semesters
        # --------------------------------------------------------
        for faculty_slug, faculty_data in faculties.items():
            faculty, faculty_created = Faculty.objects.get_or_create(
                slug=faculty_slug,
                defaults={"name": faculty_data["name"]},
            )
            if faculty_created:
                faculty_count += 1

            for department_name in faculty_data["departments"]:
                department_slug = slugify(department_name)

                department, department_created = Department.objects.get_or_create(
                    faculty=faculty,
                    name=department_name,
                    defaults={"slug": department_slug},
                )
                if department_created:
                    department_count += 1

                for level_name in levels:
                    level, level_created = Level.objects.get_or_create(
                        department=department,
                        name=level_name,
                    )
                    if level_created:
                        level_count += 1

                    for semester_name in semesters:
                        semester, semester_created = Semester.objects.get_or_create(
                            level=level,
                            name=semester_name,
                        )
                        if semester_created:
                            semester_count += 1

        # --------------------------------------------------------
        # 2. Seed Courses (only for Library and Information Science)
        # --------------------------------------------------------
        for dept_name, levels_dict in courses_data.items():
            try:
                department = Department.objects.get(name=dept_name)
            except Department.DoesNotExist:
                self.stdout.write(self.style.WARNING(f"Department '{dept_name}' not found. Skipping courses."))
                continue

            for level_name, semesters_dict in levels_dict.items():
                try:
                    level = Level.objects.get(department=department, name=level_name)
                except Level.DoesNotExist:
                    self.stdout.write(self.style.WARNING(f"Level '{level_name}' not found for {dept_name}"))
                    continue

                for semester_name, course_list in semesters_dict.items():
                    try:
                        semester = Semester.objects.get(level=level, name=semester_name)
                    except Semester.DoesNotExist:
                        self.stdout.write(self.style.WARNING(f"Semester '{semester_name}' not found"))
                        continue

                    for course_info in course_list:
                        _, created = Course.objects.get_or_create(
                            semester=semester,
                            code=course_info["code"],
                            defaults={
                                "title": course_info["title"],
                                "unit": course_info["unit"],
                            },
                        )
                        if created:
                            course_count += 1

        # --------------------------------------------------------
        # Summary
        # --------------------------------------------------------
        self.stdout.write(self.style.SUCCESS("Academic data seeded successfully."))
        self.stdout.write(f"Faculties created : {faculty_count}")
        self.stdout.write(f"Departments created: {department_count}")
        self.stdout.write(f"Levels created    : {level_count}")
        self.stdout.write(f"Semesters created : {semester_count}")
        self.stdout.write(f"Courses created   : {course_count}")