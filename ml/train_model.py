"""Train KSHAMTA's actual attrition model from the cleaned employee dataset."""
from pathlib import Path
import sys
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT))
from src.train_model import train

if __name__ == "__main__":
    metrics, selected = train()
    print("Selected model:", selected)
    for model, values in metrics.items(): print(model, {k: round(v,4) if v is not None else None for k,v in values.items()})
