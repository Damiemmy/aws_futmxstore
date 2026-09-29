from django.core.management.base import BaseCommand
from django.utils.text import slugify

from apps.academics.models import (
    Faculty,
    Department,
    Programme,
    Level,
    Semester,
    AcademicSession,
)


class Command(BaseCommand):
    help = (
        "Seed FUT Minna faculties, departments, programmes, "
        "levels, semesters and academic sessions."
    )

    def handle(self, *args, **options):

        # ============================================================
        # FACULTIES, DEPARTMENTS AND PROGRAMMES
        # ============================================================
        #
        # If a department has programmes/options:
        #
        #     Department
        #         └── Programme
        #                 └── Level
        #                         └── Semester
        #
        # If a department has NO programmes/options:
        #
        #     Department
        #         └── Level
        #                 └── Semester
        #
        # ============================================================

        faculties = {
            "SAMET": {
                "name": "School of Agricultural Management & Extension Technology",
                "departments": {
                    "Agricultural Economics and Farm Management": [],
                    "Agricultural Extension and Rural Development": [],
                    "Agribusiness": [],
                },
            },

            "SAFT": {
                "name": "School of Agronomy & Forestry Technology",
                "departments": {
                    "Crop Production": [],
                    "Soil Science and Land Management": [],
                    "Horticulture": [],
                    "Forestry and Wildlife Technology": [],
                },
            },

            "SFAT": {
                "name": "School of Food Science & Agricultural Technology",
                "departments": {
                    "Animal Production": [],
                    "Food Science Technology": [],
                    "Water Resources, Aquaculture and Fisheries Technology": [],
                    "Human Nutrition and Dietetics": [],
                },
            },

            "SAT": {
                "name": "School of Architectural Technology",
                "departments": {
                    "Architecture": [],
                    "Interior Architecture and Design": [],
                    "Landscaping Architecture": [],
                    "Furniture Design Architecture": [],
                },
            },

            "SET": {
                "name": "School of Environmental Technology",
                "departments": {
                    "Building": [],
                    "Estate Management & Valuation": [],
                    "Quantity Surveying": [],
                    "Surveying and Geoinformatics": [],
                    "Urban and Regional Planning": [],
                },
            },

            "SEET": {
                "name": "School of Electrical Engineering & Technology",
                "departments": {
                    "Computer Engineering": [],
                    "Electrical/Electronic Engineering": [],
                    "Mechatronics Engineering": [],
                    "Telecommunication Engineering": [],
                },
            },

            "SIPET": {
                "name": "School of Infrastructure, Process Engineering & Technology",
                "departments": {
                    "Agricultural and Bioresources Engineering": [],
                    "Chemical Engineering": [],
                    "Civil Engineering": [],

                    "Mechanical Engineering": [
                        "Thermo-fluids, Power Plant and Automotive",
                        "Industrial and Production",
                        "Solid Mechanics and Engineering Design",
                    ],

                    "Materials and Metallurgical Engineering": [],
                    "Petroleum and Gas Engineering": [],
                    "Food Engineering": [],
                },
            },

            "SICT": {
                "name": "School of Information & Communication Technology",
                "departments": {
                    "Computer Science": [],
                    "Cyber Security Science": [],
                    "Information Technology": [],
                    "Information Science and Media Studies": [],
                    "Data Science": [],
                    "Software Engineering": [],
                },
            },

            "SIT": {
                "name": "School of Innovative Technology",
                "departments": {
                    "Entrepreneurship": [],
                    "Logistics and Transport Technology": [],
                    "Project Management Technology": [],
                    "Procurement Management Technology": [],
                    "Logistics and Supply Chain Management": [],
                },
            },

            "SLS": {
                "name": "School of Life Sciences",
                "departments": {
                    "Animal Biology": [],
                    "Plant Biology": [],
                    "Biochemistry": [],
                    "Microbiology": [],
                    "Forensic Science": [],
                    "Public Health": [],
                    "Biotepychnology": [],
                },
            },

            "SPS": {
                "name": "School of Physical Sciences",
                "departments": {
                    "Chemistry": [
                        "Polymer Science",
                        "Industrial Chemistry",
                    ],

                    "Physics": [
                        "Electronics",
                        "Telecommunications",
                        "Computer Science",
                        "Materials Science",
                    ],

                    "Mathematics": [
                        "Industrial Mathematics",
                        "Pure and Applied Mathematics",
                    ],

                    "Industrial Mathematics": [],
                    "Statistics": [],
                    "Geology": [],
                    "Geography": [],
                    "Applied Geophysics": [],
                    "Meteorology": [],
                },
            },

            "SSTE": {
                "name": "School of Science & Technology Education",
                "departments": {
                    "Educational Technology": [],
                    "Library and Information Science": [],

                    "Industrial and Technology Education": [
                        "Automobile Technology",
                        "Electrical and Electronics Technology",
                        "Building Technology",
                        "Metalwork Technology",
                        "Woodwork Technology",
                    ],

                    "Science Education": [
                        "Biology Education",
                        "Chemistry Education",
                        "Geography Education",
                        "Mathematics Education",
                        "Physics Education",
                    ],
                },
            },

            "SBMS": {
                "name": "School of Basic Medical Sciences",
                "departments": {
                    "Medicine and Surgery": [],
                    "Human Anatomy": [],
                    "Human Physiology": [],
                },
            },

            "SAHS": {
                "name": "School of Allied Health Sciences",
                "departments": {
                    "Nursing Science": [],
                    "Medical Laboratory Science": [],
                },
            },

            "SPhS": {
                "name": "School of Pharmaceutical Sciences",
                "departments": {
                    "Doctor of Pharmacy (Pharm. D.)": [],
                },
            },
        }

        # ============================================================
        # LEVELS
        # ============================================================

        levels = [
            "100 Level",
            "200 Level",
            "300 Level",
            "400 Level",
            "500 Level",
        ]

        # ============================================================
        # SEMESTERS
        # ============================================================

        semesters = [
            "First Semester",
            "Second Semester",
        ]

        # ============================================================
        # ACADEMIC SESSIONS
        # ============================================================

        academic_sessions = [
            {
                "name": "2021/2022",
                "start_year": 2021,
                "end_year": 2022,
            },
            {
                "name": "2022/2023",
                "start_year": 2022,
                "end_year": 2023,
            },
            {
                "name": "2023/2024",
                "start_year": 2023,
                "end_year": 2024,
            },
            {
                "name": "2024/2025",
                "start_year": 2024,
                "end_year": 2025,
            },
        ]

        # ============================================================
        # COUNTERS
        # ============================================================

        faculty_count = 0
        department_count = 0
        programme_count = 0
        level_count = 0
        semester_count = 0
        academic_session_count = 0

        # ============================================================
        # SEED FACULTIES
        # ============================================================

        for faculty_slug, faculty_data in faculties.items():

            faculty, faculty_created = Faculty.objects.get_or_create(
                slug=faculty_slug,
                defaults={
                    "name": faculty_data["name"],
                },
            )

            if faculty_created:
                faculty_count += 1

            # ========================================================
            # SEED DEPARTMENTS
            # ========================================================

            for department_name, programmes in faculty_data["departments"].items():

                department_slug = slugify(department_name)

                department, department_created = (
                    Department.objects.get_or_create(
                        faculty=faculty,
                        name=department_name,
                        defaults={
                            "slug": department_slug,
                        },
                    )
                )

                if department_created:
                    department_count += 1

                # ====================================================
                # DEPARTMENT WITH PROGRAMMES
                # ====================================================

                if programmes:

                    for programme_name in programmes:

                        programme_slug = slugify(programme_name)

                        programme, programme_created = (
                            Programme.objects.get_or_create(
                                department=department,
                                name=programme_name,
                                defaults={
                                    "slug": programme_slug,
                                },
                            )
                        )

                        if programme_created:
                            programme_count += 1

                        # ============================================
                        # PROGRAMME-SPECIFIC LEVELS
                        # ============================================

                        for level_name in levels:

                            level, level_created = (
                                Level.objects.get_or_create(
                                    department=department,
                                    programme=programme,
                                    name=level_name,
                                )
                            )

                            if level_created:
                                level_count += 1

                            # ========================================
                            # SEMESTERS
                            # ========================================

                            for semester_name in semesters:

                                _, semester_created = (
                                    Semester.objects.get_or_create(
                                        level=level,
                                        name=semester_name,
                                    )
                                )

                                if semester_created:
                                    semester_count += 1

                # ====================================================
                # DEPARTMENT WITHOUT PROGRAMMES
                # ====================================================

                else:

                    for level_name in levels:

                        level, level_created = (
                            Level.objects.get_or_create(
                                department=department,
                                programme=None,
                                name=level_name,
                            )
                        )

                        if level_created:
                            level_count += 1

                        # ============================================
                        # SEMESTERS
                        # ============================================

                        for semester_name in semesters:

                            _, semester_created = (
                                Semester.objects.get_or_create(
                                    level=level,
                                    name=semester_name,
                                )
                            )

                            if semester_created:
                                semester_count += 1

        # ============================================================
        # SEED ACADEMIC SESSIONS
        # ============================================================

        for session_data in academic_sessions:

            _, session_created = AcademicSession.objects.get_or_create(
                name=session_data["name"],
                defaults={
                    "start_year": session_data["start_year"],
                    "end_year": session_data["end_year"],
                    "is_active": False,
                },
            )

            if session_created:
                academic_session_count += 1

        # ============================================================
        # SUCCESS OUTPUT
        # ============================================================

        self.stdout.write(
            self.style.SUCCESS(
                "\nAcademic data seeded successfully.\n"
            )
        )

        self.stdout.write(
            f"Faculties created: {faculty_count}"
        )

        self.stdout.write(
            f"Departments created: {department_count}"
        )

        self.stdout.write(
            f"Programmes created: {programme_count}"
        )

        self.stdout.write(
            f"Levels created: {level_count}"
        )

        self.stdout.write(
            f"Semesters created: {semester_count}"
        )

        self.stdout.write(
            f"Academic sessions created: {academic_session_count}"
        )