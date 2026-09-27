from django.core.management.base import BaseCommand
from django.utils.text import slugify

from apps.academics.models import (
    Faculty,
    Department,
    Level,
    Semester,
)


class Command(BaseCommand):

    help = "Seed FUT Minna faculties, departments, levels and semesters."

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
                    "Food Science Technology",
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
                    "Procurement Management Technology",
                    "Logistics and Supply Chain Management",
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
                    "Biotepychnology",
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

        levels = [
            "100 Level",
            "200 Level",
            "300 Level",
            "400 Level",
            "500 Level",
        ]

        semesters = [
            "First Semester",
            "Second Semester",
        ]

        faculty_count = 0
        department_count = 0
        level_count = 0
        semester_count = 0

        for faculty_slug, faculty_data in faculties.items():

            # Create faculty if it does not exist
            faculty, faculty_created = Faculty.objects.get_or_create(
                slug=faculty_slug,
                defaults={
                    "name": faculty_data["name"],
                },
            )

            if faculty_created:
                faculty_count += 1

            for department_name in faculty_data["departments"]:

                # Generate department slug automatically
                department_slug = slugify(department_name)

                # Create department if it does not exist
                department, department_created = Department.objects.get_or_create(
                    faculty=faculty,
                    name=department_name,
                    defaults={
                        "slug": department_slug,
                    },
                )

                if department_created:
                    department_count += 1

                for level_name in levels:

                    # Create level if it does not exist
                    level, level_created = Level.objects.get_or_create(
                        department=department,
                        name=level_name,
                    )

                    if level_created:
                        level_count += 1

                    for semester_name in semesters:

                        # Create semester if it does not exist
                        _, semester_created = Semester.objects.get_or_create(
                            level=level,
                            name=semester_name,
                        )

                        if semester_created:
                            semester_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                "Academic data seeded successfully."
            )
        )

        self.stdout.write(
            f"Faculties created: {faculty_count}"
        )

        self.stdout.write(
            f"Departments created: {department_count}"
        )

        self.stdout.write(
            f"Levels created: {level_count}"
        )

        self.stdout.write(
            f"Semesters created: {semester_count}"
        )
