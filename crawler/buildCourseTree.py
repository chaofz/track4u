from src.track4U import Track4U

INDEX_URL = 'https://student.apps.utah.edu/uofu/stu/ClassSchedules/main'
SEMESTER_NO = '1168';
Track4U(INDEX_URL, SEMESTER_NO).build_subj_cat_url()
