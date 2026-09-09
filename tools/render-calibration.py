from PIL import Image,ImageDraw,ImageFont
import json,math
from pathlib import Path
font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',20)
small=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',15)
def render(path):
 c=json.load(open(path));im=Image.open('dist/floorplan.png').convert('RGBA').transpose(Image.Transpose.FLIP_LEFT_RIGHT).resize((1614,1305));im=Image.blend(im,Image.new('RGBA',im.size,'white'),.25);lay=Image.new('RGBA',im.size);d=ImageDraw.Draw(lay);t=c['review']['overlay'];pt=lambda p:((p[0]-t['offsetX'])/t['scale']*3,(p[1]-t['offsetY'])/t['scale']*3)
 for w in c['walls']:
  a,b=w['a'],w['b'];L=math.dist(a,b);u=[(b[i]-a[i])/L for i in range(2)];p=lambda x:[a[i]+u[i]*x for i in range(2)];last=0
  for o in sorted(w['openings'],key=lambda o:o['start']):
   d.line([pt(p(last)),pt(p(o['start']))],fill=(0,150,140,220),width=3);q1=p(o['start']);q2=p(o['start']+o['width']);col=(220,90,0,240) if o['type']=='door' else (0,90,255,240);d.line([pt(q1),pt(q2)],fill=col,width=4)
   if o['type']=='door':
    h,e=(q1,q2) if o['hinge']=='start' else(q2,q1);v=[e[i]-h[i] for i in range(2)];points=[]
    for j in range(31):
     th=math.radians(o['swing'])*j/30;points.append(pt([h[0]+v[0]*math.cos(th)-v[1]*math.sin(th),h[1]+v[0]*math.sin(th)+v[1]*math.cos(th)]))
    d.line(points,fill=col,width=2);d.line([pt(h),points[-1]],fill=col,width=3)
   last=o['start']+o['width']
  d.line([pt(p(last)),pt(b)],fill=(0,150,140,220),width=3)
 return Image.alpha_composite(im,lay).crop((490,130,1190,1140))
before=render('archive/pre-calibration-shared-v3.json');after=render('dist/BASE_GEOMETRY_V1.json');out=Image.new('RGB',(1460,1150),'white');out.paste(before,(20,90));out.paste(after,(740,90));d=ImageDraw.Draw(out);d.text((20,15),'BEFORE - shared geometry v3',font=font,fill='#243746');d.text((740,15),'AFTER - BASE_GEOMETRY_V1',font=font,fill='#243746');d.text((20,50),'Teal: walls   Orange: doors   Blue: glazing',font=small,fill='#243746');d.text((740,50),'Same reflected original / 38.1 mm per pixel',font=small,fill='#243746');d.text((20,1110),'Printed dimensions govern. All opening dimensions: ASSUMED. Unresolved balcony curves remain uncalibrated.',font=small,fill='#243746');out.save('dist/calibration-overlay.png')
