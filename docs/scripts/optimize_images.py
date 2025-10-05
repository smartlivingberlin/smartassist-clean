import os, pathlib
from PIL import Image

SRC_DIR="assets/img"
OUT_DIR="assets/img-opt"
pathlib.Path(OUT_DIR).mkdir(parents=True, exist_ok=True)

formats=["webp","avif"]
sizes=[300,600,900]

def optimize(img_path):
    try:
        im=Image.open(img_path).convert("RGB")
    except Exception as e:
        print("❌ Fehler:",img_path,e)
        return
    base=os.path.splitext(os.path.basename(img_path))[0]
    for s in sizes:
        im_resized=im.copy()
        im_resized.thumbnail((s,s))
        for fmt in formats:
            out=f"{OUT_DIR}/{base}-{s}.{fmt}"
            im_resized.save(out,fmt.upper(),quality=80,optimize=True)
            print("✓",out)

def find_images():
    imgs=[]
    for root,_,files in os.walk(SRC_DIR):
        for f in files:
            if f.lower().endswith((".jpg",".jpeg",".png",".webp")):
                imgs.append(os.path.join(root,f))
    return imgs

if __name__=="__main__":
    imgs=find_images()
    print("Gefundene Bilder:",len(imgs))
    for img in imgs: optimize(img)
